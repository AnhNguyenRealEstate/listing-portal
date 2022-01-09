import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Listing } from '../listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingDetailsService {
    private listing$$ = new BehaviorSubject<Listing>({});
    private listing$ = this.listing$$.asObservable();

    constructor() { }

    showListing(listing: Listing) {
        this.listing$$.next(listing);
    }

    listingToShow() {
        return this.listing$;
    }
}