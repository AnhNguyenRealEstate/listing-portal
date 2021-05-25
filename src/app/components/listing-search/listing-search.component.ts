import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ListingLocationService } from './listing-location-data.service';
import { Listing, SearchCriteria } from './listing-search.data';
import { ListingSearchService } from './listing-search.service';

@Component({
    selector: 'app-listing-search',
    templateUrl: 'listing-search.component.html',
    styles: ['./listing-search.sass']
})

export class ListingSearchComponent implements OnInit {
    desktopMode: boolean = true;
    searchCriteria: SearchCriteria = {
        propertyType: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: Infinity,
        bedrooms: '',
        bathrooms: ''
    } as SearchCriteria;

    currentListingId: string = '';

    defaultMapCenter: google.maps.LatLngLiteral = { lat: 10.728991, lng: 106.708200 };
    mapOptions: google.maps.MapOptions = {
        center: this.defaultMapCenter,
        zoom: 15,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeId: 'roadmap',
    };;
    mapMarker: google.maps.MarkerOptions = {
        position: this.defaultMapCenter,
        label: {
            text: ' ',
            color: 'red'
        } as google.maps.MarkerLabel
    };;

    searchResults: Listing[] = [];

    constructor(
        private httpClient: HttpClient,
        private listingLocationService: ListingLocationService,
        private listingSearchService: ListingSearchService,
        private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        //TODO: This code belows randomly generates images for prototyping purposes
        // To be deleted and replaced with actual code to retrieve listings from the server
        for (let i = 0; i < 4; i++) {
            this.httpClient.get('https://picsum.photos/200', { responseType: 'blob' }).subscribe(response => {
                const blob = new Blob([response], { type: 'application/image' });
                const unsafeImg = URL.createObjectURL(blob);
                const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);

                const listing = {
                    id: `${i}`,
                    title: `Property ${i}`,
                    coverImage: imageUrl,
                    location: `Random Street ${i}`,
                    propertyType: ['Villa', 'Office', 'Townhouse', 'Apartment'][i],
                    price: String(Math.round(Math.random() * i * 1000))
                }
                this.searchResults.push(listing);

                // After retrieving an entry, cache it
                this.listingSearchService.cacheListing(listing);
            });
        }
    }

    onScroll() {
        //TODO: get more search result?
    }

    viewListing(listingId: string) {
        this.showLocationOnMap(listingId);
        this.currentListingId = listingId;
    }

    showLocationOnMap(listingId: string) {
        const location = this.listingLocationService.getLocationDataFromListingId(listingId);
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
                    text: ' ',
                    color: 'red'
                } as google.maps.MarkerLabel
            }
            return;
        }

        //TODO: make request with listing address to find location data
    }

    searchCompleted() {
        console.log("Search completed with the following criteria: ");
        console.log(this.searchCriteria);
    }

    openSearchModal() {

    }
}