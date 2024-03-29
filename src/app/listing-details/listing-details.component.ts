import { ChangeDetectorRef, Component, Inject, OnInit, Optional, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ListingDetailsService } from './listing-details.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { SwiperComponent } from 'ngx-useful-swiper';
import mergeImages from 'merge-images';
import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Listing } from "../listing-card/listing-card.data";
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { SwiperOptions } from 'swiper';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['./listing-details.component.scss'],
    animations: [
        trigger('listingAnim', [
            transition(':enter', [
                query('.listing-header', style({ opacity: 0.2, transform: 'translateY(40px)' })),
                query('.listing-body', style({ opacity: 0.2, transform: 'translateY(40px)' })),
                query('.listing-header', animate(
                    '250ms 50ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' }))),
                query('.listing-body', animate(
                    '250ms 100ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' })))
            ])
        ]),
        trigger('listingMobileAnim', [
            transition(':enter', [
                query('.listing-header', style({ opacity: 0.2, transform: 'translateY(40px)' })),
                query('.listing-photos', style({ opacity: 0.2, transform: 'translateY(40px)' })),
                query('.listing-body', style({ opacity: 0.2, transform: 'translateY(40px)' })),
                query('.listing-header', animate(
                    '250ms 50ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' }))),
                query('.listing-photos', animate(
                    '250ms 100ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' }))),
                query('.listing-body', animate(
                    '250ms 150ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' })))
            ])
        ])
    ]
})

export class ListingDetailsComponent implements OnInit {
    listing: Listing = {} as Listing;

    images: Array<Object> = [];
    imageSources: string[] = [];
    watermarkImg = '';
    allImagesLoaded: boolean = false;
    gettingAllImages: boolean = false;

    showVideo = false;
    videoLink!: SafeResourceUrl;

    contactNumberUrl: SafeUrl = '';

    swiperDesktopConfig: SwiperOptions = {
        navigation: {
            nextEl: '.swiper-button-next-desktop',
            prevEl: '.swiper-button-prev-desktop'
        },
        pagination: { el: '.swiper-pagination-desktop', clickable: false },
        effect: "slide",
        autoHeight: true,
        zoom: true,
        slidesPerView: 3,
        centeredSlides: true,
        initialSlide: 1,
        spaceBetween: 16
    };

    swiperMobileConfig: SwiperOptions = {
        pagination: { el: '.swiper-pagination-mobile', clickable: false },
        navigation: {
            nextEl: '.swiper-button-next-mobile',
            prevEl: '.swiper-button-prev-mobile'
        },
        spaceBetween: 16,
        effect: "coverflow",
        autoHeight: true,
        zoom: true
    };

    showFooter: boolean = false;
    isDesktop: boolean = true;

    isModal: boolean = false;

    constructor(
        private sanitizer: DomSanitizer,
        public translate: TranslateService,
        public listingDetails: ListingDetailsService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private snackbar: MatSnackBar,
        private changeDetector: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
        @Optional() private _bottomSheetRef: MatBottomSheetRef<ListingDetailsComponent>,
        @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private data: { listing: Listing }
    ) {
        const width = this.document.defaultView ? this.document.defaultView.innerWidth : 0;
        const mobileDevicesWidth = 600;
        this.isDesktop = width > mobileDevicesWidth;

        if (this.data?.listing) {
            this.listing = this.data.listing;
            this.isModal = true;
        }
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('listingId') || this.listing.id;
        if (!id) {
            this.router.navigate(['../'], { relativeTo: this.route });
            return;
        }

        const listing = await this.listingDetails.getListingById(id);
        if (!listing) {
            this.router.navigate(['../details/not-found'], { relativeTo: this.route })
            return;
        }

        this.listing = listing;

        this.listingDetails.getInitialImageUrls(listing.fireStoragePath!).then(async imgSrcs => {
            if (imgSrcs.length) {
                await this.applyWatermarkToImagesAndDisplay(imgSrcs);
                this.showFooter = true;
                this.changeDetector.detectChanges();
            }
        });

        if (listing.contactNumber) {
            this.contactNumberUrl = this.sanitizer.bypassSecurityTrustUrl(
                `tel:${listing.contactNumber}`
            );
        } else {
            this.contactNumberUrl = this.sanitizer.bypassSecurityTrustUrl(
                `tel:${this.translate.instant('listing_details.default_contact_number')}`
            );
        }

        this.setBrowserTitle();

        if (listing.tiktokUrl) {
            await this.getTiktokVideo(listing.tiktokUrl);
        }

        logEvent(getAnalytics(), 'listing_details_view', {
            id: listing.id,
            category: listing.category,
            location: listing.location
        });
    }

    cycleToSlide(usefulSwiper: SwiperComponent, slideId: number) {
        usefulSwiper.swiper.slideTo(slideId);
    }

    async getAllImages(isMobile?: boolean) {
        this.gettingAllImages = true;
        const imgSrcs = await this.listingDetails.getAllImages(this.listing.fireStoragePath!);
        if (imgSrcs.length) {
            await this.applyWatermarkToImagesAndDisplay(imgSrcs);
            this.allImagesLoaded = true;
            this.changeDetector.detectChanges();
        }
        this.gettingAllImages = false

        if (isMobile) {
            this.showAllImgsLoadedMsg();
        }
    }

    async showAllImgsLoadedMsg() {
        this.snackbar.open(
            this.translate.instant("listing_details.all_imgs_loaded"),
            undefined,
            { duration: 1000 }
        );
    }

    async getTiktokVideo(videoUrl: string) {

        const loadScript = (url: string) => {
            return new Promise((resolve, reject) => {

                if (document.getElementById('tiktok-script')) {
                    resolve("loaded");
                }
                const script = document.createElement("script");
                script.async = true;
                script.src = url;
                script.setAttribute('id', 'tiktok-script');

                script.onload = () => {
                    // script is loaded successfully, call resolve()
                    resolve("loaded");
                };

                script.onerror = () => {
                    // script is not loaded, call reject()
                    reject("error");
                };

                document.head.appendChild(script);
            });
        }

        const tiktokScriptStatus = await loadScript('https://www.tiktok.com/embed.js');
        if (tiktokScriptStatus !== "loaded") {
            return;
        }

        const videoIdRegex = /video\/(.+?(?![0-9]))/;
        const regexResult = videoIdRegex.exec(videoUrl);
        if (!regexResult) {
            return;
        }

        const videoId = regexResult[1];
        this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.tiktok.com/embed/v2/${videoId}`);
        this.showVideo = true;

    }

    async applyWatermarkToImagesAndDisplay(imgSrcs: string[]) {
        const tempImageSrcs = new Array<string>(imgSrcs.length);
        const tempImages = new Array<Object>(imgSrcs.length);

        // Fetch watermark image
        if (!this.watermarkImg) {
            const response = await fetch('/assets/images/logo.png');
            const data = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const metadata = {
                type: contentType
            };
            const fileExtension = contentType.split('/').pop() || '';
            const file = new File([data], `watermark.${fileExtension}`, metadata);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                this.watermarkImg = reader.result as string;
            };
        }

        // Apply the watermark to images from Firebase
        await Promise.all(imgSrcs.map(async (imgSrc, index) => {

            // Get Firebase image
            const response = await fetch(imgSrc);
            const blob = await response.blob();
            const file = new File([blob], `${index}.jpg`, { type: blob.type });

            let imgAsBase64 = '';
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                imgAsBase64 = reader.result as string;

                //Apply watermark to Firebase image, temporarily disabled
                //const watermarkedImgBase64 = await mergeImages([imgAsBase64, this.watermarkImg]);

                const watermarkedImgBase64 = imgAsBase64; //await mergeImages([imgAsBase64, this.watermarkImg]);
                tempImageSrcs[index] = watermarkedImgBase64;

                //Create thumbnails
                const sanitizedUrl = this.sanitizer.sanitize(
                    SecurityContext.URL,
                    this.sanitizer.bypassSecurityTrustUrl(watermarkedImgBase64)
                );
                tempImages[index] = {
                    image: sanitizedUrl,
                    thumbImage: sanitizedUrl,
                    alt: `Image ${index}`
                }
            }
        }));

        this.imageSources = tempImageSrcs;
        this.images = tempImages;
    }

    setBrowserTitle() {
        const purpose: string = this.listing.purpose === 'For Rent'
            ? this.translate.instant("listing_details.for_rent")
            : this.translate.instant("listing_details.for_sale");

        const category = this.translate.instant(
            `property_category.${this.listing.category?.toLowerCase()}`
        ).toLowerCase();

        const numOfBeds = `${this.listing.bedrooms} ${this.translate.instant("listing_details.bedrooms").toLowerCase()}`;
        const numOfBaths = `${this.listing.bathrooms} ${this.translate.instant("listing_details.bathrooms").toLowerCase()}`;

        if (this.translate.currentLang === 'en') {
            if (this.listing.category === 'Commercial') {
                this.title.setTitle(`${this.listing.location} ${category} ${purpose.toLowerCase()}`);
            } else {
                this.title.setTitle(`${this.listing.location} ${category} ${numOfBeds} ${numOfBaths} ${purpose.toLowerCase()}`);
            }
        } else if (this.translate.currentLang === 'vn') {
            if (this.listing.category === 'Commercial') {
                this.title.setTitle(`${purpose} ${category} ${this.listing.location}`);

            } else {
                this.title.setTitle(`${purpose} ${category} ${this.listing.location} ${numOfBeds} ${numOfBaths}`);
            }
        }
    }

    closeDetails() {    
        this._bottomSheetRef.dismiss();
    }
}