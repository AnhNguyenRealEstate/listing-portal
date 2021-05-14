import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListingSearchService {
    listingIdLocationDataMap: Map<string, number[]> = new Map();

    constructor(private httpClient: HttpClient) {
        for (let i = 0; i <= 4; i++) {
            this.listingIdLocationDataMap.set(i.toString(),
                [Math.round(Math.random() * 100), Math.round(Math.random() * 100)]);
        }
    }

    getListingsFromServer(): Observable<any> {
        return this.httpClient.get('');
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