import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Listing } from '../listing-search.data';
import { ListingDetailsService } from './listing-details.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { SwiperComponent } from 'ngx-useful-swiper';

@Component({
    selector: 'listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['../listing-search.component.scss']
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
        private title: Title) {
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

        this.contactNumber = this.sanitizer.bypassSecurityTrustUrl(
            `tel:${await this.translate.get('listing_details.contact_number').toPromise()}`
        );

        this.title.setTitle(`Anh Nguyen - ${listing.location} | ${listing.price} ${listing.currency}`);
    }

    cycleToSlide(slideId: number) {
        this.usefulSwiper?.swiper.slideTo(slideId);
    }
}