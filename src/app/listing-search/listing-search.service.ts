import { Inject, Injectable } from '@angular/core';
import { SearchCriteria } from './listing-search.data';
import { Listing } from "../listing-card/listing-card.data";
import { Firestore, CollectionReference, DocumentData, Query, query, where, collection, orderBy, DocumentSnapshot, limit, startAfter, limitToLast } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreCollections } from 'src/app/shared/globals';
import { getDocs, QuerySnapshot } from '@firebase/firestore';
import { DOCUMENT } from '@angular/common';
import { getAnalytics, logEvent } from '@angular/fire/analytics';

@Injectable({ providedIn: 'root' })
export class ListingSearchService {
    private searchResults$$ = new BehaviorSubject<Listing[]>([]);
    private searchResults$ = this.searchResults$$.asObservable();

    private searchInProgress$$ = new BehaviorSubject<boolean>(false);
    private searchInProgress$ = this.searchInProgress$$.asObservable();

    private resultCount$$ = new BehaviorSubject<number>(0);
    private resultCount$ = this.resultCount$$.asObservable();

    private desktopPaginationLimit = 30;
    private mobilePaginationLimit = 21;
    private paginationLimit: number = this.desktopPaginationLimit;
    private lastResultOfCurrentPagination!: DocumentSnapshot;

    private currentSearchCriteria!: SearchCriteria;
    private currentQuery!: Query<DocumentData>;
    private querySnapshot!: QuerySnapshot<DocumentData>;

    constructor(
        private firestore: Firestore,
        @Inject(DOCUMENT) { defaultView }: Document) {
        const width = defaultView ? defaultView.innerWidth : 0;
        const mobileDevicesWidth = 600;
        if (width <= mobileDevicesWidth) {
            this.paginationLimit = this.mobilePaginationLimit;
        }
    }

    async getListingsByCriteria(newSearchCriteria: SearchCriteria): Promise<Listing[]> {
        this.searchInProgress$$.next(true);

        newSearchCriteria = { ...newSearchCriteria };
        const results: Listing[] = [];

        if (this.isNewSnapshotNeeded(newSearchCriteria)) {
            logEvent(getAnalytics(), 'search_criteria_applied', {
                ...this.currentSearchCriteria
            });

            this.currentSearchCriteria = newSearchCriteria;
            this.currentQuery = this.criteriaToQuery(
                collection(this.firestore, FirestoreCollections.listings),
                newSearchCriteria
            );
            this.querySnapshot = await getDocs(
                this.currentQuery
            );
        }

        if (this.querySnapshot?.size === 0) {
            this.searchInProgress$$.next(false);
            return [];
        }

        const docs = this.querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const listing = doc.data() as Listing;

            if (i === (docs.length - 1)) {
                this.lastResultOfCurrentPagination = doc;
            }

            const listingPassesCriteria = this.applyRangedQueries(listing, newSearchCriteria);
            if (listingPassesCriteria) {
                results.push(listing);
            }
        }

        this.resultCount$$.next(results.length);
        this.searchInProgress$$.next(false);
        return results;
    }

    private isNewSnapshotNeeded(newSearchCriteria: SearchCriteria) {
        return !this.querySnapshot || (this.currentSearchCriteria.category !== newSearchCriteria.category)
            || (this.currentSearchCriteria.purpose !== newSearchCriteria.purpose)
            || (this.currentSearchCriteria.location !== newSearchCriteria.location)
            || (this.currentSearchCriteria.orderBy) !== newSearchCriteria.orderBy;
    }

    private criteriaToQuery(
        listings: CollectionReference<DocumentData>,
        criteria: SearchCriteria
    ): Query<DocumentData> {
        let q = query(listings, where('purpose', '==', criteria.purpose?.trim() || 'For Rent'));

        if (criteria.location) q = query(q, where('location', '==', criteria.location.trim()));
        if (criteria.category) q = query(q, where('category', '==', criteria.category.trim()));

        if (criteria.orderBy === 'Most Affordable') {
            q = query(q, orderBy('price', 'asc'));
        } else if (criteria.orderBy === 'Most Recent') {
            q = query(q, orderBy('creationDate', 'desc'));
        } else if (criteria.orderBy === 'Least Affordable') {
            q = query(q, orderBy('price', 'desc'));
        } else if (criteria.orderBy === 'Least Recent') {
            q = query(q, orderBy('creationDate', 'asc'));
        }

        q = query(q, limit(this.paginationLimit));

        return q as Query<DocumentData>;
    }

    private applyRangedQueries(listing: Listing, criteria: SearchCriteria) {
        const propertySizesToMinMaxSizes = (propertySizes: string): number[] => {
            switch (propertySizes) {
                case '_050to100': return [50, 100];
                case '_100to200': return [100, 200];
                case '_200to300': return [200, 300];
                case '_300to400': return [300, 400];
                case '_400plus': return [400, 9999];
                default: return [0, 9999];
            }
        }
        const minMaxSizes = propertySizesToMinMaxSizes(criteria.propertySize);
        const minSize = minMaxSizes[0];
        const maxSize = minMaxSizes[1];
        // Range queries to be done here as Firestore does not allow it
        // Filter by property size
        if (
            listing.propertySize! > maxSize ||
            listing.propertySize! < minSize) {
            return false;
        }

        // Filter by max and min prices
        const maxPrice = criteria.maxPrice || Number.POSITIVE_INFINITY;
        if (
            listing.price! > maxPrice ||
            listing.price! < criteria.minPrice) {
            return false;
        }

        // Filter by bathrooms
        if (criteria.bathrooms === "3+") {
            if (Number(listing.bathrooms) <= 3) {
                return false;
            }
        } else if (criteria.bathrooms) {
            if (Number(criteria.bathrooms) != listing.bathrooms!) {
                return false;
            }
        }

        // Filter by bedrooms
        if (criteria.bedrooms === "3+") {
            if (Number(listing.bedrooms) <= 3) {
                return false;
            }
        } else if (criteria.bedrooms) {
            if (Number(criteria.bedrooms) != listing.bedrooms!) {
                return false;
            }
        }

        return true;
    }

    searchInProgress() {
        return this.searchInProgress$;
    }

    searchResults() {
        return this.searchResults$;
    }

    resultCount() {
        return this.resultCount$;
    }

    setSearchResults(value: Listing[]) {
        this.searchResults$$.next(value);
    }

    async getMoreResults(): Promise<Listing[]> {
        const results: Listing[] = [];
        const additionalDocs = await getDocs(
            query(this.currentQuery,
                startAfter(this.lastResultOfCurrentPagination),
                limit(this.paginationLimit)
            )
        );

        const docs = additionalDocs.docs;

        if (!docs.length) {
            return results;
        }

        this.lastResultOfCurrentPagination = docs[docs.length - 1];

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const listing = doc.data() as Listing;
            const listingPassesCriteria = this.applyRangedQueries(listing, this.currentSearchCriteria);
            if (listingPassesCriteria) {
                results.push(listing);
            }
        }

        this.resultCount$$.next(this.resultCount$$.value + results.length);
        return results;
    }
}
