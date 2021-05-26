import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Listing } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'app-listing-details',
    templateUrl: 'listing-details.component.html'
})

export class ListingDetailsComponent implements OnChanges {
    @Input() listingId: string = '';
    listing: Listing = {} as Listing;

    //TODO: refactor into image preview component or so
    carouselInterval = 0;
    carousel: NgbCarousel | undefined;
    @ViewChild('carousel', { static: false }) set content(content: NgbCarousel) {
        if(content) { // initially setter gets called with undefined
            this.carousel = content;
        }
     }
    constructor(
        private listingSearchService: ListingSearchService,
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer) {
    }

    async ngOnChanges() {
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

    cycleToSlide(slideId: number) {
        this.carousel?.select("ngb-slide-" + String(slideId));
    }
}