import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { getDownloadURL, listAll, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FirestoreCollections, ImageFileVersion } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Listing } from '../listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingDetailsService {

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private router: Router
    ) { }

    showListing(id: string) {
        const url = this.router.serializeUrl(this.router.createUrlTree([`listings/details/${id}`]));
        window.open(url, '_blank');
    }

    /**
     * Get a listing from Firestore by its Id
     * @param listingId The Firebase Id of the listing
     * @returns A Promise that resolves to a Listing object or undefined if Firebase Id is invalid
     */
    async getListingById(listingId: string): Promise<Listing | undefined> {
        const dbResponse = await getDoc(doc(collection(this.firestore, FirestoreCollections.listings), listingId)).catch(() => { });

        if (!(dbResponse && dbResponse.exists())) {
            return undefined;
        }

        return dbResponse.data() as Listing;
    }

    async getImageSrcs(imageFolderPath: string): Promise<string[]> {
        if (!environment.production) {
            return [];
        }

        const allImgs = (await listAll(ref(this.storage, imageFolderPath))).prefixes;
        return await Promise.all<string>(allImgs.map(async image => {
            return await getDownloadURL(ref(image, ImageFileVersion.raw))
        }));
    }
}