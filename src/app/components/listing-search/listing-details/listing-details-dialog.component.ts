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

export class ListingDetailsDialogComponent implements OnInit{
    listing!: Listing;
    carouselInterval = 0;

    constructor(public dialogRef: MatDialogRef<ListingDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private listingId: string,
        private listingSearchService: ListingSearchService,
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer) {
    }

    async ngOnInit() {
        this.listing = await this.listingSearchService.getListingById(this.listingId);

        // TODO: replace the code below and actually retrieve images from imageSources
        // property
        this.listing.imageSources = [];
        for (let i = 0; i < 10; i++) {
            this.httpClient.get(`https://picsum.photos/400/200?query=${i}`, { responseType: 'blob' }).subscribe(response => {
                const blob = new Blob([response], { type: 'application/image' });
                const unsafeImg = URL.createObjectURL(blob);
                const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
                this.listing.imageSources!.push(imageUrl as string);
            });
        }
    }
}