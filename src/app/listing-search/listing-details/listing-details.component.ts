import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Listing } from '../listing-search.data';
import { ListingDetailsService } from './listing-details.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['../listing-search.component.scss']
})

export class ListingDetailsComponent implements OnInit {
    listing: Listing = {} as Listing;
    images: Array<Object> = [];
    contactNumber: SafeUrl = '';

    carouselInterval = 0;
    carousel: NgbCarousel | undefined;
    @ViewChild('carousel', { static: false }) set content(content: NgbCarousel) {
        if (content) {
            this.carousel = content;
        }
    }

    constructor(
        private sanitizer: DomSanitizer,
        private translate: TranslateService,
        private listingDetailsService: ListingDetailsService,
        private route: ActivatedRoute,
        private router: Router) {
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
                    order: index,
                    alt: `Image ${index}`
                }
            })
        }

        this.contactNumber = this.sanitizer.bypassSecurityTrustUrl(
            `tel:${await this.translate.get('listing_details.contact_number').toPromise()}`
        );
    }

    cycleToSlide(slideId: number) {
        this.carousel?.select("ngb-slide-" + String(slideId));
    }
}