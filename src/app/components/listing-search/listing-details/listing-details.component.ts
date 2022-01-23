import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Listing } from '../listing-search.data';
import { ListingDetailsService } from './listing-details.service';

@Component({
    selector: 'app-listing-details',
    templateUrl: 'listing-details.component.html'
})

export class ListingDetailsComponent implements OnInit, OnDestroy {
    showListing: boolean = false;
    listing: Listing = {} as Listing;
    subscriptions = new Subscription();

    carouselInterval = 0;
    carousel: NgbCarousel | undefined;
    @ViewChild('carousel', { static: false }) set content(content: NgbCarousel) {
        if (content) { // initially setter gets called with undefined
            this.carousel = content;
        }
    }
    
    constructor(private listingDetailsService: ListingDetailsService) {
    }

    ngOnInit() {
        this.subscriptions.add(this.listingDetailsService.listingToShow().subscribe(listing => {
            if(!listing.location) return;
            
            this.listing = listing;
            this.showListing = true;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    cycleToSlide(slideId: number) {
        this.carousel?.select("ngb-slide-" + String(slideId));
    }
}