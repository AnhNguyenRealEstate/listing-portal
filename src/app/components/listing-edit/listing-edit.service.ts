import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreCollections } from 'src/app/shared/globals';
import { Listing } from '../listing-search/listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingEditService {
    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage) { }

    /* Completely remove the listing from DB */
    async deleteListing(listing: Listing, dbRefId: string) {
        const allImages = await this.storage.storage.ref(listing.imageFolderPath!).listAll();
        await Promise.all(allImages.items.map(async image => await image.delete()));
        await this.firestore.collection(FirestoreCollections.listings).doc(dbRefId).delete();
    }

    /* Change archived property of the listing */
    async archiveListing(dbRefId: string) {
        await this.firestore.collection(FirestoreCollections.listings).doc(dbRefId).update({ archived: true });
    }

    async unarchiveListing(dbRefId: string) {
        await this.firestore.collection(FirestoreCollections.listings).doc(dbRefId).update({ archived: false });
    }
}