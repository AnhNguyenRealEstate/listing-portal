import { Component, Inject, OnInit } from '@angular/core';
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
        this.dialogRef.close(this.searchCriteria);
    }
}