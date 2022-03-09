import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class ListingLocationService {
    private listingIdLocationDataMap: Map<string, number[]> = new Map();

    private mapType = 'roadmap';
    private mapMarkerText = ' ';
    private mapMarkerColor = 'red';
    private centerOfPMHCoordinates = { lat: 10.728991, lng: 106.708200 };

    private defaultMapOptions = {
        center: this.centerOfPMHCoordinates,
        zoom: 15,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeId: this.mapType
    }

    private defaultMarkerOptions = {
        position: this.centerOfPMHCoordinates,
        label: {
            text: this.mapMarkerText,
            color: this.mapMarkerColor
        } as google.maps.MarkerLabel
    }

    private _mapOptions: google.maps.MapOptions = {
        ...this.defaultMapOptions
    };;

    private _markerOptions: google.maps.MarkerOptions = {
        ...this.defaultMarkerOptions
    };;

    private geoCoder = new google.maps.Geocoder();

    private mapOptions$$ = new BehaviorSubject<google.maps.MapOptions>(this._mapOptions);
    private mapOptions$ = this.mapOptions$$.asObservable();

    private markerOptions$$ = new BehaviorSubject<google.maps.MarkerOptions>(this._markerOptions);
    private markerOptions$ = this.markerOptions$$.asObservable();

    constructor() {
    }

    private setCoordinatesToListingId(listingId: string, coordinates: number[]) {
        if (coordinates.length !== 2) {
            return;
        }
        this.listingIdLocationDataMap.set(listingId, coordinates);
    }

    private getCoordinatesFromListingId(listingId: string) {
        if (!listingId) {
            return undefined;
        }
        return this.listingIdLocationDataMap.get(listingId);
    }

    async showLocationOnMap(listingId: string, address: string) {
        let coordinates = this.getCoordinatesFromListingId(listingId);
        if (coordinates) {
            this.setMapAndMarkerOptions(coordinates);
            return;
        }

        this.geoCoder.geocode({
            address: address
        }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK
                && results && results[0]?.geometry?.location) {
                coordinates = [
                    results[0].geometry.location.lat(),
                    results[0].geometry.location.lng()
                ]
            }
            else {
                coordinates = [this.centerOfPMHCoordinates.lat, this.centerOfPMHCoordinates.lng];
            }
            this.setMapAndMarkerOptions(coordinates);
            this.setCoordinatesToListingId(listingId, coordinates);
        });

    }

    private setMapAndMarkerOptions(coordinates: number[]) {
        this._mapOptions = {
            ...this.defaultMapOptions,
            center: { lat: coordinates[0], lng: coordinates[1] }
        };
        this.mapOptions$$.next(this._mapOptions);

        this._markerOptions = {
            ...this.defaultMarkerOptions,
            position: { lat: coordinates[0], lng: coordinates[1] }
        }
        this.markerOptions$$.next(this._markerOptions);
    }

    mapOptions() {
        return this.mapOptions$;
    }

    markerOptions() {
        return this.markerOptions$;
    }
}