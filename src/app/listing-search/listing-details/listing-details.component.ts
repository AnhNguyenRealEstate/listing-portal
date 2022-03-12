import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Listing } from '../listing-search.data';
import { ListingDetailsService } from './listing-details.service';
import { DomSanitizer, Meta, SafeUrl } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { SwiperComponent } from 'ngx-useful-swiper';

@Component({
    selector: 'listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['../listing-search.component.scss', './listing-details.component.scss']
})

export class ListingDetailsComponent implements OnInit {
    listing: Listing = {} as Listing;
    images: Array<Object> = [];
    contactNumber: SafeUrl = '';

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
        if (listing.imageSources?.length) {
            this.images = listing.imageSources!.map((imageSrc, index) => {
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

        if (listing.contactNumber) {
            this.contactNumber = this.sanitizer.bypassSecurityTrustUrl(
                `tel:${listing.contactNumber}`
            );
        } else {
            this.contactNumber = this.sanitizer.bypassSecurityTrustUrl(
                `tel:${await this.translate.get('listing_details.default_contact_number').toPromise()}`
            );
        }

        this.setHeaderMetadata();
    }

    cycleToSlide(slideId: number) {
        this.usefulSwiper?.swiper.slideTo(slideId);
    }

    async setHeaderMetadata() {
        this.title.setTitle(`Anh Nguyen - ${this.listing.location} | ${this.listing.price} ${this.listing.currency}`);
        this.meta.updateTag({ name: 'og:url', content: this.router.url });
        this.meta.updateTag({ name: 'og:image', content: this.listing.imageSources![0] });

        const langTerms = await this.translate.get(
            ["listing_details.bedrooms",
                "listing_details.bathrooms",
                "listing_details.apartment",
                "listing_details.villa",
                "listing_details.townhouse",
                "listing_details.commercial",
                "listing_details.contact"]).toPromise();

        let description = '';
        let keyToUse = '';
        if (this.listing.propertyType !== 'Commercial') {
            switch (this.listing.propertyType) {
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

        this.meta.updateTag({ name: 'og:description', content: description });
    }
}