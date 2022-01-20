import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppDataService } from 'src/app/shared/app-data.service';
import { SearchCriteria, PropertySizes } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';
import { SearchBarDialogComponent } from './search-bar-dialog.component';

@Component({
    selector: 'app-search-bar',
    templateUrl: 'search-bar.component.html'
})

export class SearchBarComponent implements OnInit {
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
        private appDataService: AppDataService
    ) {
    }

    ngOnInit() {
        this.subs.add(this.appDataService.propertyTypes().subscribe(data => {
            this.propertyTypes = data;
        }));

        this.subs.add(this.appDataService.locations().subscribe(data => {
            this.locations = data;
        }));

        this.getListings();
    }

    async getListings(criteria: SearchCriteria = this.searchCriteria) {
        const results = await this.listingSearchService.getListingsByCriteria(criteria);
        this.listingSearchService.setSearchResults(results);
        this.numberOfResults = results.length;
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