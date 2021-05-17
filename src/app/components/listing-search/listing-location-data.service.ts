import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ListingLocationService {
    listingIdLocationDataMap: Map<string, number[]> = new Map();

    constructor() {
        //Random location data to demonstrate that Google Map works
        for (let i = 0; i < 4; i++) {
            this.listingIdLocationDataMap.set(i.toString(),
                [Math.round(Math.random() * 100), Math.round(Math.random() * 100)]);
        }
    }

    setLocationDataToListingId(listingId: string, locationData: number[]) {
        if (locationData.length !== 2) {
            return;
        }
        this.listingIdLocationDataMap.set(listingId, locationData);
    }

    getLocationDataFromListingId(listingId: string) {
        if (!listingId) {
            return;
        }
        return this.listingIdLocationDataMap.get(listingId);
    }

}