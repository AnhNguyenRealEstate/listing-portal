import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Listing } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'app-listing-details',
    templateUrl: 'listing-details.component.html'
})

export class ListingDetailsComponent implements OnInit, OnChanges {
    @Input() listingId: string = '';
    listing: Listing = {} as Listing;

    constructor(private listingSearchService: ListingSearchService) {
    }

    ngOnInit() {
    }

    async ngOnChanges() {
        this.listing = await this.listingSearchService.getListingById(this.listingId);
    }
}