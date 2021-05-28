import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Listing } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'app-listing-details-dialog',
    templateUrl: 'listing-details-dialog.component.html'
})

export class ListingDetailsDialogComponent {
    listing!: Listing;
    carouselInterval = 0;

    constructor(public dialogRef: MatDialogRef<ListingDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private listingData: Listing,
        private listingSearchService: ListingSearchService,
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer) {
            this.listing = listingData;
    }
}