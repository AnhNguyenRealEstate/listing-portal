import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Listing } from "src/app/listing-card/listing-card.data";
import { FirestoreCollections } from 'src/app/shared/globals';

@Injectable({ providedIn: 'root' })
export class HomeService {
    public numberOfListingsToFeature = 6;

    constructor(
        private firestore: Firestore,
    ) { }

    async getFeaturedListings() {
        const featuredListings = await getDocs(
            query(
                collection(this.firestore, FirestoreCollections.listings),
                where("featured", "==", true),
                limit(this.numberOfListingsToFeature)
            )
        );

        const results = await Promise.all(featuredListings.docs.map(async doc => {
            const listing = doc.data() as Listing;
            return listing;
        }));

        return results;
    }
}