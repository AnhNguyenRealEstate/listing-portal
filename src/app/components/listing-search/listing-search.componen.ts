import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Listing } from './listing-search.data';
import { ListingSearchService } from './listing-search.service';

@Component({
    selector: 'app-listing-search',
    templateUrl: 'listing-search.component.html',
    styles: ['./listing-search.sass']
})

export class ListingSearchComponent implements OnInit {
    @Input() desktopMode: boolean = true;

    mapOptions: google.maps.MapOptions = {
        center: { lat: 10.728991, lng: 106.708200 },
        zoom: 15,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeId: 'roadmap'
    };

    mapMarker: google.maps.MarkerOptions = {
        position: { lat: 10.728991, lng: 106.708200 },
        label: {
            color: 'red'
        } as google.maps.MarkerLabel
    };

    searchResults: Listing[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private httpClient: HttpClient,
        private listingSearchService: ListingSearchService,
        private sanitizer: DomSanitizer) {
        this.activatedRoute.params.subscribe(params => {
            const test = params[''];
            //TODO: make request to the server to get search results
        });
    }

    ngOnInit() {
        //TODO: This code belows randomly generates images for prototyping purposes
        // To be deleted and replaced with actual code
        for (let i = 0; i < 4; i++) {
            this.httpClient.get('https://picsum.photos/200', { responseType: 'blob' }).subscribe(response => {
                const blob = new Blob([response], { type: 'application/image' });
                const unsafeImg = URL.createObjectURL(blob);
                const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);

                this.searchResults.push({
                    id: `${i}`,
                    title: `Property ${i}`,
                    coverImage: imageUrl,
                    location: `Random Street ${i}`,
                    propertyType: ['Villa', 'Office', 'Townhouse', 'Apartment'][i],
                    price: String(Math.round(Math.random() * i * 1000))
                });
            });
        }
    }

    onScroll() {
        //TODO: get more search result?
    }

    showLocationOnMap(listingId: string) {
        const location = this.listingSearchService.getLocationDataFromListingId(listingId);
        if (location) {
            this.mapOptions = {
                center: { lat: location[0], lng: location[1] },
                zoom: 15,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                mapTypeId: 'roadmap'
            };

            this.mapMarker = {
                position: { lat: location[0], lng: location[1] },
                label: {
                    color: 'red'
                } as google.maps.MarkerLabel
            }
            return;
        }

        //TODO: make request with listing address to find location data
    }
}