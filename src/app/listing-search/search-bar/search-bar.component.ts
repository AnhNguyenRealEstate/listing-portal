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
    selector: 'app-search-bar',
    templateUrl: 'search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})

export class SearchBarComponent implements OnInit, OnDestroy {
    @Input() mode: 'desktop' | 'mobile' = 'desktop';
    @Output() searchCompleted = new EventEmitter();

    searchCriteria: SearchCriteria = {
        propertyType: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: 9999,
        bedrooms: '',
        bathrooms: ''
    } as SearchCriteria;

    propertyTypes: string[] = [];
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
        this.subs.add(this.metadata.propertyTypes().subscribe(data => {
            this.propertyTypes = data;
        }));

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

    openSearchModal() {
        const config = {
            position: { bottom: '10em' } as DialogPosition,
            height: 'auto',
            width: 'auto',
            scrollStrategy: new NoopScrollStrategy(),
            data: this.searchCriteria
        } as MatDialogConfig;
        const dialogRef = this.dialog.open(SearchBarDialogComponent, config);

        dialogRef.afterClosed().subscribe(result => {
            if (result?.isSearchBtnClick) {
                this.searchCriteria = result.criteria;
                this.getListings(result.criteria);
            }
        });
    }

}