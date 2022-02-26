import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { LoadSpinnerService } from 'src/app/load-spinner/load-spinner.service';
import { Listing } from '../listing-search.data';
import { ListingDetailsService } from './listing-details.service';

@Component({
    selector: 'app-listing-details',
    templateUrl: 'listing-details.component.html',
    styleUrls: ['../listing-search.component.scss']
})

export class ListingDetailsComponent implements OnInit {
    listing: Listing = {} as Listing;
    images: Array<Object> = [];

    carouselInterval = 0;
    carousel: NgbCarousel | undefined;
    @ViewChild('carousel', { static: false }) set content(content: NgbCarousel) {
        if (content) { // initially setter gets called with undefined
            this.carousel = content;
        }
    }

    constructor(
        private listingDetailsService: ListingDetailsService,
        private loadSpinner: LoadSpinnerService,
        private route: ActivatedRoute) {
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('listingId');
        if (!id) return;

        this.loadSpinner.start();
        const listing = await this.listingDetailsService.getListingById(id);
        this.loadSpinner.stop();

        if (!listing) return;
        this.listing = listing;
    }

    cycleToSlide(slideId: number) {
        this.carousel?.select("ngb-slide-" + String(slideId));
    }
}