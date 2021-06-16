import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Listing } from '../listing-search.data';

@Component({
    selector: 'app-listing-details-dialog',
    templateUrl: 'listing-details-dialog.component.html'
})

export class ListingDetailsDialogComponent {
    listing!: Listing;
    carouselInterval = 0;

    constructor(public dialogRef: MatDialogRef<ListingDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private listingData: Listing) {
            this.listing = this.listingData;
    }
}