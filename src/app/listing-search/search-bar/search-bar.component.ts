import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LoadSpinnerService } from 'src/app/load-spinner/load-spinner.service';
import { MetadataService } from 'src/app/shared/metadata.service';
import { SearchCriteria, PropertySizes } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';
import { SearchBarDialogComponent } from './search-bar-dialog.component';

@Component({
    selector: 'search-bar',
    templateUrl: 'search-bar.component.html'
})

export class SearchBarComponent implements OnInit, OnDestroy {
    @Input() mode: 'desktop' | 'mobile' = 'desktop';
    panelOpenState: boolean = false;

    searchCriteria: SearchCriteria = {
        propertyType: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: undefined,
        bedrooms: '',
        bathrooms: '',
        purpose: 'For Rent'
    } as SearchCriteria;

    locations: string[] = [];
    
    propertySizes = PropertySizes;

    subs: Subscription = new Subscription();

    numberOfResults: number = 0;

    constructor(
        private dialog: MatDialog,
        private listingSearchService: ListingSearchService,
        private metadata: MetadataService,
        private loadSpinner: LoadSpinnerService
    ) {
    }

    ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));

        this.getListings();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    async getListings(criteria: SearchCriteria = this.searchCriteria) {
        this.loadSpinner.start();
        const results = await this.listingSearchService.getListingsByCriteria(criteria);
        this.listingSearchService.setSearchResults(results);
        this.numberOfResults = results.length;
        this.loadSpinner.stop();
    }
}