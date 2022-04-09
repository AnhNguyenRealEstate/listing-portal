import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';
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
    fetchingMoreResults: boolean = false;
    numberOfMockListings = Array(1).fill(0);
    snackbarMsgs: any;

    constructor(public listingSearchService: ListingSearchService,
        private snackbar: MatSnackBar,
        private translate: TranslateService) { }

    async ngOnInit() {
        this.subscription.add(this.listingSearchService.searchResults().subscribe(results => {
            this.searchResults = results;
        }));

        this.snackbarMsgs = await lastValueFrom(
            this.translate.get(['search_results.more_content', 'search_results.dismiss'])
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async onScroll() {
        const results = await this.listingSearchService.getMoreResults();

        if (!results.length) {
            return
        }

        for (const listing of results) {
            if (this.searchResults.find(result => result.id == listing.id)) {
                continue;
            }
            this.searchResults.push(listing);
        }

        this.snackbar.open(
            this.snackbarMsgs['search_results.more_content'],
            this.snackbarMsgs['search_results.dismiss'],
            {
                duration: 1500
            }
        )
    }
}