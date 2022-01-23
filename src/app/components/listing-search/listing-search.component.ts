import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { Subscription } from 'rxjs';
import { ListingDetailsService } from './listing-details/listing-details.service';

@Component({
    selector: 'app-listing-search',
    templateUrl: 'listing-search.component.html'
})

export class ListingSearchComponent implements OnInit, OnDestroy {
    showListingDetails: boolean = false;
    sub: Subscription = new Subscription();

    constructor(
        private listingDetails: ListingDetailsService,
        private pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit() {
        this.sub.add(this.listingDetails.listingToShow().subscribe(listing => {
            this.showListingDetails = !!listing.location;
        }));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    scrollTop() {
        this.pageScrollService.scroll({
            document: this.document,
            scrollTarget: '.navbar',
            duration: 250
        });
    }
}