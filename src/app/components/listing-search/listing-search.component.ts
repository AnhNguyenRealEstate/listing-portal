import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingSpinnerService } from '../load-spinner/loading-spinner.service';
import { ListingDetailsDialogComponent } from './listing-details/listing-details-dialog.component';
import { ListingLocationService } from './listing-location-data.service';
import { Listing, Locations, PropertySizes, PropertyTypes, SearchCriteria } from './listing-search.data';
import { ListingSearchService } from './listing-search.service';
import { SearchBarDialogComponent } from './search-bar/search-bar-dialog.component';

@Component({
    selector: 'app-listing-search',
    templateUrl: 'listing-search.component.html',
    styles: ['./listing-search.sass']
})

export class ListingSearchComponent implements OnInit {
    searchCriteria: SearchCriteria = {
        propertyType: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: Infinity,
        bedrooms: '',
        bathrooms: ''
    } as SearchCriteria;

    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

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
        private loadSpinnerService: LoadingSpinnerService,
        private sanitizer: DomSanitizer,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this.searchResults = [];
        this.listingSearchService.clearCache();
        //TODO: This code belows randomly generates images for prototyping purposes
        // To be deleted and replaced with actual code to retrieve listings from the server
        for (let i = 0; i < 50; i++) {
            this.httpClient.get(`https://picsum.photos/200?query=${i}`, { responseType: 'blob' }).subscribe(response => {
                const blob = new Blob([response], { type: 'application/image' });
                const unsafeImg = URL.createObjectURL(blob);
                const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);

                const price = Math.ceil(Math.random() * i * 1000)
                const listing = {
                    id: `${i}`,
                    title: `Property ${i}`,
                    coverImage: imageUrl,
                    address: `Random Street ${i}`,
                    propertyType: ['Villa', 'Office', 'Townhouse', 'Apartment'][i % 4],
                    location: ['Riverpark Premier', 'Midtown Sakura', 'Le Jardin', 'Nam Phuc'][i % 4],
                    price: String(price),
                    forRent: price > 3000
                } as Listing;
                this.searchResults.push(listing);

                // After retrieving an entry, cache it
                this.listingSearchService.cacheListing(listing);
            });
        }
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

        //TODO: make request with listing address to find location data using geocoding API
    }

    searchCompleted() {

    }

    openSearchModal() {
        const config = {
            position: {
                bottom: '150px'
            } as DialogPosition,
            height: 'auto',
            width: '90%',
            data: this.searchCriteria
        } as MatDialogConfig;
        const dialogRef = this.dialog.open(SearchBarDialogComponent, config);

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }

            this.searchCriteria = result as SearchCriteria;
            // TODO: remove the following after correctly setting up search bar and firebase comm.
            this.ngOnInit();
        });
    }

    async viewListingMobile(listingId: string) {
        const listing = await this.listingSearchService.getListingById(listingId);

        // TODO: replace the code below and actually retrieve images from imageSources
        // property
        listing.imageSources = [];
        for (let i = 0; i < 10; i++) {
            this.httpClient.get(`https://picsum.photos/400/200?query=${i}`, { responseType: 'blob' }).subscribe(response => {
                const blob = new Blob([response], { type: 'application/image' });
                const unsafeImg = URL.createObjectURL(blob);
                const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
                listing.imageSources!.push(imageUrl as string);
            });
        }

        const isLoadingSub = this.loadSpinnerService.isLoading$.subscribe(isLoading => {
            if (!isLoading) {
                const config = {
                    height: '95%',
                    width: '100%',
                    data: listing
                } as MatDialogConfig;
                isLoadingSub.unsubscribe();
                this.dialog.open(ListingDetailsDialogComponent, config);
            }
        });
    }
}