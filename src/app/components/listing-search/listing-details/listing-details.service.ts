import { Injectable } from '@angular/core';
import { getDownloadURL, listAll, ref, Storage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { ImageFileVersion } from 'src/app/shared/globals';
import { Listing } from '../listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingDetailsService {
    private listing$$ = new BehaviorSubject<Listing>({});
    private listing$ = this.listing$$.asObservable();

    constructor(
        private storage: Storage
    ) { }

    showListing(listing: Listing) {
        this.listing$$.next(listing);
    }

    async getImageSrcs(imageFolderPath: string): Promise<string[]> {
        const allImgs = (await listAll(ref(this.storage, imageFolderPath))).prefixes;
        return await Promise.all<string>(allImgs.map(async image => {
            return await getDownloadURL(ref(image, ImageFileVersion.raw))
        }));
    }

    listingToShow() {
        return this.listing$;
    }
}