import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing, SearchCriteria } from './listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingSearchService {
    listings: Map<string ,Listing> = new Map<string, Listing>();

    constructor(private httpClient: HttpClient) {

    }

    getListingsByCriteria(searchCriteria: SearchCriteria): Observable<any> {
        // TODO: make http request to the server to retrieve the listings
        // based on criteria
        return this.httpClient.get('');
    }

    async getListingById(listingId: string): Promise<Listing> {
        let listing = this.listings.get(listingId);
        if(listing){
            return listing;
        }

        // TODO: make request to the server to get the listing based on id
        const response = await this.httpClient.get('').toPromise() as Listing;
        return response;
    }

    cacheListing(listing: Listing){
        this.listings.set(listing.id, listing);
    }
}