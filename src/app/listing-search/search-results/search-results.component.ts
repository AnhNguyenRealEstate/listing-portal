import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListingDetailsService } from '../listing-details/listing-details.service';
import { ListingLocationService } from '../listing-location/listing-location.service';
import { Listing } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'search-results',
    templateUrl: 'search-results.component.html',
    styleUrls: ['../listing-search.component.scss']
})

export class SearchResultsComponent implements OnInit, OnDestroy {
    @Input() mode: 'desktop' | 'mobile' = 'desktop';
    subscription = new Subscription();
    searchResults: Listing[] = [];

    constructor(public listingSearchService: ListingSearchService,
        private listingLocationService: ListingLocationService,
        private listingDetailsService: ListingDetailsService) { }

    ngOnInit() {
        this.subscription.add(this.listingSearchService.searchResults().subscribe(results => {
            this.searchResults = results;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    viewListingDetails(listing: Listing) {
        this.listingLocationService.showLocationOnMap(listing.id!, listing.address!);
        this.listingDetailsService.showListing(listing.id!);
    }
}