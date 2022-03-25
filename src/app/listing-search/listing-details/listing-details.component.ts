import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Listing } from '../listing-search.data';
import { ListingDetailsService } from './listing-details.service';
import { DomSanitizer, Meta, SafeUrl } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { SwiperComponent } from 'ngx-useful-swiper';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['../listing-search.component.scss', './listing-details.component.scss']
})

export class ListingDetailsComponent implements OnInit {
    listing: Listing = {} as Listing;
    images: Array<Object> = [];
    contactNumberUrl: SafeUrl = '';

    @ViewChild('usefulSwiper', { static: false }) usefulSwiper!: SwiperComponent;
    highlightedThumbnailRef: any;

    constructor(
        private sanitizer: DomSanitizer,
        private translate: TranslateService,
        private listingDetailsService: ListingDetailsService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private meta: Meta) {
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('listingId');
        if (!id) {
            this.router.navigate(['/listing-search']);
            return;
        }

        const listing = await this.listingDetailsService.getListingById(id);
        if (!listing) {
            this.router.navigate(['/listing-search']);
            return;
        }

        this.listing = listing;

        this.listingDetailsService.getListingImageUrls(listing?.fireStoragePath!).then(imgSrcs => {
            if (imgSrcs.length) {
                this.listing.imageSources = imgSrcs;
                this.images = this.listing.imageSources!.map((imageSrc, index) => {
                    const sanitizedUrl = this.sanitizer.sanitize(
                        SecurityContext.URL,
                        this.sanitizer.bypassSecurityTrustUrl(imageSrc)
                    );
                    return {
                        image: sanitizedUrl,
                        thumbImage: sanitizedUrl,
                        alt: `Image ${index}`
                    }
                })
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

        this.setHeaderMetadata();
    }

    cycleToSlide(slideId: number) {
        this.usefulSwiper?.swiper.slideTo(slideId);
    }

    async setHeaderMetadata() {
        const langTerms = await lastValueFrom(this.translate.get(
            [
                "app_title",
                "listing_details.bedrooms",
                "listing_details.bathrooms",
                "listing_details.apartment",
                "listing_details.villa",
                "listing_details.townhouse",
                "listing_details.commercial",
                "listing_details.contact"]
        ));


        this.title.setTitle(`${langTerms['app_title']} | ${this.listing.location} ${this.listing.price} ${this.listing.currency}`);

        let description = '';
        let keyToUse = '';
        if (this.listing.category !== 'Commercial') {
            switch (this.listing.category) {
                case 'Apartment':
                    keyToUse = "listing_details.apartment";
                    break;
                case 'Townhouse':
                    keyToUse = "listing_details.townhouse";
                    break;
                case 'Villa':
                    keyToUse = "listing_details.villa";
                    break;
            }
            description = `${langTerms[keyToUse]} 
                           ${this.listing.bedrooms} ${langTerms["listing_details.bedrooms"]} 
                           ${this.listing.bathrooms} ${langTerms["listing_details.bathrooms"]}
                           ${langTerms["listing_details.contact"]}: ${this.listing.contactNumber}`
        }
    }
}