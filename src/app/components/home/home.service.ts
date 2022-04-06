import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, limit, query, where } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Listing } from 'src/app/listing-search/listing-search.data';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async getFeaturedListings() {
        const featuredListings = await getDocs(
            query(
                collection(this.firestore, FirestoreCollections.listings),
                where("featured", "==", true),
                limit(3))
        );

        const results = await Promise.all(featuredListings.docs.map(async doc => {
            const listing = doc.data() as Listing;
            return listing;
        }));

        return results;
    }
}