import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Locations, PropertySizes, PropertyTypes, SearchCriteria } from '../listing-search.data';

@Component({
    selector: 'app-search-bar-dialog',
    templateUrl: 'search-bar-dialog.component.html'
})

export class SearchBarDialogComponent implements OnInit {
    searchCriteria: SearchCriteria = {
        propertyType: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: Infinity,
        bedrooms: '',
        bathrooms: ''
    } as SearchCriteria;

    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    constructor(
        public dialogRef: MatDialogRef<SearchBarDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: SearchCriteria
    ) {
        this.searchCriteria = { ...this.data };
    }

    ngOnInit() { }

    async getListings() {
        //TODO: submit criteria to server, once the response comes back,
        //save the data to listing-search service

        //const response = await this.httpClient.get('').toPromise();
        this.dialogRef.close(this.searchCriteria);
    }
}