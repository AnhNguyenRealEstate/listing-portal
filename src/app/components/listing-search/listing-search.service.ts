import { Injectable } from '@angular/core';
import { Listing, SearchCriteria } from './listing-search.data';
import { Firestore, CollectionReference, DocumentData, orderBy, Query, query, where, collection, getDoc, doc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { FirestoreCollections, ImageFileVersion } from 'src/app/shared/globals';
import { getDocs } from '@firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ListingSearchService {
    private searchResults$$ = new BehaviorSubject<Listing[]>([]);
    private searchResults$ = this.searchResults$$.asObservable();

    constructor(private firestore: Firestore, private storage: Storage) {
    }

    async getListingsByCriteria(searchCriteria: SearchCriteria): Promise<Listing[]> {

        function criteriaToDBQuery(ref: CollectionReference<DocumentData>, criteria: SearchCriteria): Query<DocumentData> {
            let q = query(ref, orderBy('price', 'desc'));
            if (criteria.bathrooms) {
                if (criteria.bathrooms === '3+') {
                    q = query(q, where('bathrooms', '>=', 3));
                } else {
                    q = query(q, where('bathrooms', '==', Number(criteria.bathrooms)));
                }
            }
            if (criteria.bedrooms) {
                if (criteria.bedrooms === '3+') {
                    q = query(q, where('bedrooms', '>=', 3));
                } else {
                    q = query(q, where('bedrooms', '==', Number(criteria.bedrooms)));
                }
            }
            if (criteria.location) q = query(q, where('location', '==', criteria.location));
            if (criteria.propertyType) q = query(q, where('propertyType', '==', criteria.propertyType));
            return q as Query<DocumentData>;
        }


        const results: Listing[] = [];
        const dbResponse = await getDocs(
            criteriaToDBQuery(collection(this.firestore, FirestoreCollections.listings),
                searchCriteria
            ));

        if (!dbResponse) {
            return [];
        }

        const minMaxSizes = this.propertySizesToMinMaxSizes(searchCriteria.propertySize);
        const minSize = minMaxSizes[0];
        const maxSize = minMaxSizes[1];

        const docs = dbResponse.docs;
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const listing = doc.data() as Listing;

            // Range queries to be done here as Firestore does not allow it
            if (
                listing.propertySize! > maxSize ||
                listing.propertySize! < minSize) {
                continue;
            }
            if (
                listing.price! > searchCriteria.maxPrice ||
                listing.price! < searchCriteria.minPrice) {
                continue;
            }

            listing.id = doc.id;

            if (listing.imageFolderPath) {
                listing.coverImage = await getDownloadURL(ref(this.storage, `${listing.imageFolderPath}/0/${ImageFileVersion.compressed}`));
            }

            results.push(listing);
        }
        return results;
    }

    /**
     * Get a listing from Firestore by its Id
     * @param listingId The Firebase Id of the listing
     * @returns A Promise that resolves to a Listing object or undefined if Firebase Id is invalid
     */
    async getListingById(listingId: string): Promise<Listing | undefined> {
        const dbResponse = await getDoc(doc(collection(this.firestore, FirestoreCollections.listings), listingId)).catch(() => { });

        if (!dbResponse) {
            return undefined;
        }

        const listingRef = dbResponse.ref
        if (!listingRef) {
            return undefined;
        }

        return dbResponse.data() as Listing;
    }

    searchResults() {
        return this.searchResults$;
    }

    setSearchResults(value: Listing[]) {
        this.searchResults$$.next(value);
    }

    private propertySizesToMinMaxSizes(propertySizes: string): number[] {
        switch (propertySizes) {
            case '_050to100': return [50, 100];
            case '_100to200': return [100, 200];
            case '_200to300': return [200, 300];
            case '_300to400': return [300, 400];
            case '_400plus': return [400, 9999];
            default: return [0, 9999];
        }
    }
}