import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SearchCriteria, PropertyTypes, Locations, PropertySizes } from '../listing-search.data';
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

    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    numberOfResults: number = 0;

    constructor(private dialog: MatDialog, private listingSearchService: ListingSearchService) {
    }

    ngOnInit() {
       this.getListings();
    }

    async getListings() {
        const results = await this.listingSearchService.getListingsByCriteria(this.searchCriteria);
        this.numberOfResults = results.length;
        this.listingSearchService.setSearchResults(results);
    }

    async openSearchModal() {
        const config = {
            position: { bottom: '10em' } as DialogPosition,
            height: 'auto',
            width: 'auto',
            scrollStrategy: new NoopScrollStrategy(),
            data: this.searchCriteria
        } as MatDialogConfig;
        const dialogRef = this.dialog.open(SearchBarDialogComponent, config);

        const newCriteria = await dialogRef.afterClosed().toPromise<SearchCriteria>();
        const results = await this.listingSearchService.getListingsByCriteria(newCriteria);
        this.listingSearchService.setSearchResults(results);
    }

}