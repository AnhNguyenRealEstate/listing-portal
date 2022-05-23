import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Listing } from "../../listing-card/listing-card.data";
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

    isLoadingMore: boolean = false;
    noMoreToLoad: boolean = false;

    constructor(public listingSearchService: ListingSearchService) { }

    async ngOnInit() {
        this.subscription.add(this.listingSearchService.searchResults().subscribe(results => {
            this.searchResults = results;
            this.noMoreToLoad = false;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async loadMore() {
        this.isLoadingMore = true;
        const results = await this.listingSearchService.getMoreResults();

        if (!results.length) {
            this.noMoreToLoad = true;
            this.isLoadingMore = false;
            return
        }

        for (const listing of results) {
            if (this.searchResults.find(result => result.id == listing.id)) {
                continue;
            }
            this.searchResults.push(listing);
        }

        this.isLoadingMore = false;
    }

    removeListing(listing: Listing) {
        this.searchResults = this.searchResults.filter(results => results.id !== listing.id);
    }
}