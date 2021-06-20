import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Locations, PropertySizes, PropertyTypes, SearchCriteria } from '../listing-search.data';

@Component({
    selector: 'app-search-bar-dialog',
    templateUrl: 'search-bar-dialog.component.html'
})

export class SearchBarDialogComponent {
    searchCriteria: SearchCriteria = {} as SearchCriteria;

    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    constructor(
        public dialogRef: MatDialogRef<SearchBarDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: SearchCriteria
    ) {
        this.searchCriteria = { ...this.data };
    }

    getListings() {
        this.dialogRef.close({isSearchBtnClick: true, criteria: this.searchCriteria});
    }
}