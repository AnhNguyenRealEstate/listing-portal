import { Injectable } from '@angular/core';
import { Listing, SearchCriteria } from './listing-search.data';
import { AngularFirestore, DocumentData, Query } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListingSearchService {
    private searchResults$$ = new BehaviorSubject<Listing[]>([]);
    private searchResults$ = this.searchResults$$.asObservable();

    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {
    }

    async getListingsByCriteria(searchCriteria: SearchCriteria): Promise<Listing[]> {
        const results: Listing[] = [];
        const dbResponse = await this.firestore
            .collection(
                'listings',
                ref => this.criteriaToDBQuery(ref, searchCriteria)
            ).get().toPromise().catch(error => console.log(error));

        if (!dbResponse) {
            return [];
        }

        // Must continue to filter based on minSize, maxSize
        // Firestore only allows range query on one field
        const minMaxSizes = this.propertySizesToMinMaxSizes(searchCriteria.propertySize);
        const minSize = minMaxSizes[0];
        const maxSize = minMaxSizes[1];

        const docs = dbResponse.docs;
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const listing = doc.data() as Listing;
            if (
                listing.propertySize! > maxSize ||
                listing.propertySize! < minSize) {
                continue;
            }

            listing.id = doc.id;

            if (listing.imageFolderPath) {
                listing.coverImage = await this.storage.storage.ref(listing.imageFolderPath).child('0').getDownloadURL();
            }

            results.push(listing);
        }
        return results;
    }

    async getListingById(listingId: string): Promise<Listing | undefined> {
        const dbResponse = await this.firestore
            .collection(
                'listings'
            ).get().toPromise().catch(error => console.log(error));

        if (!dbResponse) {
            return undefined;
        }

        const listingRef = dbResponse.docs.find(doc => doc.id === listingId);
        if (!listingRef) {
            return undefined;
        }

        const listing = listingRef?.data() as Listing;
        if (!listing.imageFolderPath) {
            return listing;
        }

        listing.imageSources = [];
        const images = await this.storage.ref(listing.imageFolderPath).listAll().toPromise();
        for (let i = 0; i < images.items.length; i++) {
            listing.imageSources.push(await images.items[i].getDownloadURL());
        }

        return listing;
    }

    searchResults() {
        return this.searchResults$;
    }

    setSearchResults(value: Listing[]) {
        this.searchResults$$.next(value);
    }

    private criteriaToDBQuery(ref: DocumentData, criteria: SearchCriteria): Query<DocumentData> {
        let query = ref;
        if (criteria.bathrooms) query = query.where('bathrooms', '==', criteria.bathrooms);
        if (criteria.bedrooms) query = query.where('bedrooms', '==', criteria.bedrooms);
        if (criteria.location) query = query.where('location', '==', criteria.location);
        if (criteria.maxPrice) query = query.where('price', '<=', criteria.maxPrice);
        if (criteria.minPrice) query = query.where('price', '>=', criteria.minPrice);
        if (criteria.propertyType) query = query.where('propertyType', '==', criteria.propertyType);

        return query as Query<DocumentData>;
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