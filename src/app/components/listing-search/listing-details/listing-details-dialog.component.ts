import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Listing } from '../listing-search.data';

@Component({
    selector: 'app-listing-details-dialog',
    templateUrl: 'listing-details-dialog.component.html'
})

export class ListingDetailsDialogComponent implements OnInit {
    listing!: Listing;
    images: Array<Object> = [];
    carouselInterval = 0;

    constructor(
        public dialogRef: MatDialogRef<ListingDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private listingData: Listing,
        private httpClient: HttpClient) {
        this.listing = this.listingData;
    }

    async ngOnInit() {
        if (!this.listing.imageSources) {
            return;
        }

        for (let i = 0; i < this.listing.imageSources.length; i++) {
            const response = await this.httpClient
                .get(
                    `https://picsum.photos/200?query=${i}`,
                    { responseType: 'blob' }
                ).toPromise().catch(error => console.log(error));

            if (!response) {
                return;
            }
            
            const blob = new Blob([response], { type: 'application/image' });
            const unsafeImg = URL.createObjectURL(blob);

            this.images.push({
                image: unsafeImg,
                thumbImage: unsafeImg,
                alt: `Image ${i}`
            });
        }
    }
}