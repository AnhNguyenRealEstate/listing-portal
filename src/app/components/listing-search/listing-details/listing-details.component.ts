import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Listing } from '../listing-search.data';

@Component({
    selector: 'app-listing-details',
    templateUrl: 'listing-details.component.html'
})

export class ListingDetailsComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute) { 
    }

    ngOnInit() { 
        const listingId = this.activatedRoute.snapshot.params.listingId;

        //TODO: check the listing service to see if this listing is already retrieved
        // if yes, bind the data and call the server to get more as necessary
        // if not, call the server to retrieve the listing
    }
}