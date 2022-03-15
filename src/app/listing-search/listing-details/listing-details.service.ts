import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { getDownloadURL, listAll, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FirebaseStorageFolders, FirestoreCollections, ImageFileVersion } from 'src/app/shared/globals';
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

        if (!environment.production) {
            listing.imageSources = new Array<string>();
            for (let i = 0; i < 5; i++) {
                listing.imageSources.push(`https://picsum.photos/1920/1080/?${i}`);
            }
            for (let i = 0; i < 5; i++) {
                listing.imageSources.push(`https://picsum.photos/1080/1920/?${i}`);
            }
            return listing;
        }

        const storagePath = listing.fireStoragePath!;

        const imageStoragePath = `${storagePath}/${FirebaseStorageFolders.listingImgsVideos}`;
        let allImages = (await listAll(ref(this.storage, imageStoragePath))).prefixes;
        allImages.sort((a, b) => {
            if (Number(a.name) > Number(b.name)) return 1;
            if (Number(a.name) < Number(b.name)) return -1;
            return 0;
        });

        listing.imageSources = new Array(allImages.length);

        await Promise.all(allImages.map(async (imageFile, index) => {
            listing.imageSources![index] = await getDownloadURL(ref(imageFile, ImageFileVersion.compressed));
        }));

        return listing;
    }
}