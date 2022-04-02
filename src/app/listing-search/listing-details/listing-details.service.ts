import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { getDownloadURL, listAll, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Listing } from '../listing-search.data';

@Injectable({ providedIn: 'any' })
export class ListingDetailsService {

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private router: Router
    ) { }

    showListing(id: string) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`listings/details/${id}`])
        );
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

        const listing = dbResponse.data() as Listing;
        return listing;
    }

    async getListingImageUrls(storagePath: string): Promise<string[]> {
        const imageStoragePath = `${storagePath}/${FirebaseStorageConsts.listingImgsVideos}`;
        let allImages = (await listAll(ref(this.storage, imageStoragePath))).items;
        allImages.sort((a, b) => {
            if (Number(a.name) > Number(b.name)) return 1;
            if (Number(a.name) < Number(b.name)) return -1;
            return 0;
        });

        const imageSources = new Array(allImages.length);

        await Promise.all(allImages.map(async (imageFile, index) => {
            imageSources![index] = await getDownloadURL(ref(imageFile));
        }));

        return imageSources;
    }
}