import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListingLocationService } from './listing-location.service';

@Component({
    selector: 'app-listing-location',
    templateUrl: 'listing-location.component.html'
})

export class ListingLocationComponent implements OnInit, OnDestroy {
    markerOptions: google.maps.MarkerOptions | undefined = undefined;
    mapOptions: google.maps.MapOptions | undefined = undefined;
    subscriptions = new Subscription();

    constructor(private listingLocationService: ListingLocationService) { }

    ngOnInit() {
        this.subscriptions.add(this.listingLocationService.mapOptions().subscribe(options => {
            this.mapOptions = options;
        }));

        this.subscriptions.add(this.listingLocationService.markerOptions().subscribe(options => {
            this.markerOptions = options;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}