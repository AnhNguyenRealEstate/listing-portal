import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataGeneratorService } from '../../data-generator/data-generator.service';
import { ListingDetailsDialogComponent } from '../listing-details/listing-details-dialog.component';
import { ListingDetailsService } from '../listing-details/listing-details.service';
import { ListingLocationService } from '../listing-location/listing-location.service';
import { Listing } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'app-search-results',
    templateUrl: 'search-results.component.html'
})

export class SearchResultsComponent implements OnInit, OnDestroy {
    @Input() mode: 'desktop' | 'mobile' = 'desktop';
    subscription = new Subscription();
    searchResults: Listing[] = [];

    constructor(private listingSearchService: ListingSearchService,
        private listingLocationService: ListingLocationService,
        private listingDetailsService: ListingDetailsService,
        private generator: DataGeneratorService,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.subscription.add(this.listingSearchService.searchResults().subscribe(results => {
            this.searchResults = results;
            for (let i = 0; i < this.searchResults.length; i++) {
                this.generator.generateImageSrcs(this.searchResults[i]);
            }
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    viewListingDetails(listing: Listing) {
        this.listingLocationService.showLocationOnMap(listing.id!, listing.address!);
        this.listingDetailsService.showListing(listing);
    }

    viewListingDetailsMobile(listing: Listing) {
        const config = {
            height: '95%',
            width: 'auto',
            scrollStrategy: new NoopScrollStrategy(),
            data: listing
        } as MatDialogConfig;
        this.dialog.open(ListingDetailsDialogComponent, config);
    }
}