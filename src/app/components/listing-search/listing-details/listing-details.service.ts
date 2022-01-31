import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { Listing } from '../listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingDetailsService {
    private listing$$ = new BehaviorSubject<Listing>({});
    private listing$ = this.listing$$.asObservable();

    constructor(
        private storage: AngularFireStorage
    ) { }

    showListing(listing: Listing) {
        this.listing$$.next(listing);
    }

    async getImageSrcs(imageFolderPath: string) {
        const allImgs = await this.storage.storage.ref(imageFolderPath).listAll();
        return await Promise.all<string>(allImgs.items.map(async image => await image.getDownloadURL()));
    }

    listingToShow() {
        return this.listing$;
    }
}