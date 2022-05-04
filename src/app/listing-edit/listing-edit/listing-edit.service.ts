import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Firestore, deleteDoc, updateDoc, doc, collection, Query, DocumentData, query, orderBy, limit, getDocs, startAfter, DocumentSnapshot } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage } from '@angular/fire/storage';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { Listing } from '../../listing-search/listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingEditService {
    private desktopPaginationLimit = 8;
    private mobilePaginationLimit = 5;
    private _paginationLimit: number = this.desktopPaginationLimit;
    private _lastResultOfCurrentPagination!: DocumentSnapshot;

    private _queryListingsByCreationDateDesc!: Query<DocumentData>;

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        @Inject(DOCUMENT) { defaultView }: Document) {
        const width = defaultView ? defaultView.innerWidth : 0;
        const mobileDevicesWidth = 600;
        if (width <= mobileDevicesWidth) {
            this._paginationLimit = this.mobilePaginationLimit;
        }

        this._queryListingsByCreationDateDesc = query(collection(this.firestore, FirestoreCollections.listings),
            orderBy("creationDate", 'desc'),
            limit(this._paginationLimit));
    }

    async getMoreListings(): Promise<Listing[]> {
        const snapshot = await getDocs(
            query(this._queryListingsByCreationDateDesc, startAfter(this._lastResultOfCurrentPagination))
        );

        const snapshotDocs = snapshot.docs;
        this.setLastResultOfPagination(snapshotDocs[snapshotDocs.length - 1]);
        return await Promise.all(snapshotDocs.map(doc => doc.data() as Listing));
    }

    /* Completely remove the listing from DB */
    //TODO: move to cloud functions for batch delete
    async deleteListing(listing: Listing, dbRefId: string) {
        const imgsVideosStoragePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.listingImgsVideos}`
        listAll(ref(this.storage, imgsVideosStoragePath)).then(result => {
            const allImages = result.items;
            allImages.map(image => {
                deleteObject(ref(image));
            });
        })

        const coverImagePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.coverImage}`;
        deleteObject(ref(this.storage, coverImagePath));

        deleteDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbRefId}`));
    }

    /* Change archived property of the listing */
    async archiveListing(dbRefId: string) {
        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), dbRefId),
            'archived',
            true
        );
    }

    async unarchiveListing(dbRefId: string) {
        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), dbRefId),
            'archived',
            false
        );
    }

    async featureListing(dbRefId: string) {
        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), dbRefId),
            'featured',
            true
        );
    }

    async unfeatureListing(dbRefId: string) {
        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), dbRefId),
            'featured',
            false
        );
    }

    getLastResultOfCurrentPagination() {
        return this._lastResultOfCurrentPagination;
    }

    setLastResultOfPagination(lastResult: DocumentSnapshot) {
        this._lastResultOfCurrentPagination = lastResult;
    }

    paginationLimit() {
        return this.paginationLimit;
    }

    queryListingsByCreationDateDesc() {
        return this._queryListingsByCreationDateDesc;
    }
}