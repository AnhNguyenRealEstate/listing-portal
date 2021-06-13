import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ListingDetailsDialogComponent } from '../listing-details/listing-details-dialog.component';
import { ListingDetailsService } from '../listing-details/listing-details.service';
import { ListingLocationService } from '../listing-location/listing-location.service';
import { Listing } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'app-search-results',
    templateUrl: 'search-results.component.html'
})

export class SearchResultsComponent implements OnInit {
    @Input() mode: 'desktop' | 'mobile' = 'desktop';
    searchResults: Listing[] = [];

    constructor(private listingSearchService: ListingSearchService,
        private listingLocationService: ListingLocationService,
        private listingDetailsService: ListingDetailsService,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.listingSearchService.searchResults().subscribe(results =>
            this.searchResults = results
        );
    }

    viewListing(listing: Listing) {
        this.listingLocationService.showLocationOnMap(listing.address!);
        this.listingDetailsService.showListing(listing);
    }

    async viewListingMobile(listing: Listing) {
        const config = {
            height: '95%',
            width: 'auto',
            scrollStrategy: new NoopScrollStrategy(),
            data: listing
        } as MatDialogConfig;
        this.dialog.open(ListingDetailsDialogComponent, config);

    }
}