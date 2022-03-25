import { Injectable } from '@angular/core';
import { Firestore, deleteDoc, updateDoc, doc, collection } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Listing } from '../../listing-search/listing-search.data';

@Injectable({ providedIn: 'any' })
export class ListingEditService {
    constructor(
        private firestore: Firestore,
        private storage: Storage) {
    }

    /* Completely remove the listing from DB */
    async deleteListing(listing: Listing, dbRefId: string) {
        const imgsVideosStoragePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.listingImgsVideos}`
        listAll(ref(this.storage, imgsVideosStoragePath)).then(result => {
            const allImages = result.items;
            allImages.map(image => {
                deleteObject(ref(image));
            });
        })

        const coverImagePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.coverImage}`
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
}