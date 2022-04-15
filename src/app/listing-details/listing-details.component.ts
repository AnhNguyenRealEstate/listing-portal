import { ChangeDetectorRef, Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ListingDetailsService } from './listing-details.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { SwiperComponent } from 'ngx-useful-swiper';
import { lastValueFrom } from 'rxjs';
import mergeImages from 'merge-images';
import { CurrencyPipe } from '@angular/common';
import { Listing } from '../listing-search/listing-search.data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAnalytics, logEvent } from '@angular/fire/analytics';

@Component({
    selector: 'listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['./listing-details.component.scss']
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

    @ViewChild('usefulSwiper', { static: false }) usefulSwiper!: SwiperComponent;
    highlightedThumbnailRef: any;

    showFooter: boolean = false;

    constructor(
        private sanitizer: DomSanitizer,
        public translate: TranslateService,
        public listingDetails: ListingDetailsService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private currency: CurrencyPipe,
        private snackbar: MatSnackBar,
        private changeDetector: ChangeDetectorRef) {
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('listingId');
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
                `tel:${await lastValueFrom(this.translate.get('listing_details.default_contact_number'))}`
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

    cycleToSlide(slideId: number) {
        this.usefulSwiper?.swiper.slideTo(slideId);
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
            await lastValueFrom(this.translate.get("listing_details.all_imgs_loaded")),
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

                //Apply watermark to Firebase image
                const watermarkedImgBase64 = await mergeImages([imgAsBase64, this.watermarkImg]);
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

    async setBrowserTitle() {
        const appTitle = await lastValueFrom(this.translate.get(
            "app_title"
        ));
        const purpose: string = this.listing.purpose === 'For Rent' ? await lastValueFrom(this.translate.get(
            "listing_details.for_rent"
        )) : await lastValueFrom(this.translate.get(
            "listing_details.for_sale"
        ));

        this.title.setTitle(`${appTitle} | ${this.listing.location} 
                            ${this.currency.transform(this.listing.price, this.listing.currency, 'symbol', '1.0-0')} 
                            ${purpose.toLowerCase()}`);
    }
}