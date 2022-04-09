import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

    constructor(public listingSearchService: ListingSearchService) { }

    ngOnInit() {
        this.subscription.add(this.listingSearchService.searchResults().subscribe(results => {
            this.searchResults = results;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}