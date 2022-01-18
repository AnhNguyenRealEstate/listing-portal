import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Listing } from '../listing-search/listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingEditService {
    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage) { }

    /* Completely remove the listing from DB */
    async deleteListing(listing: Listing, dbRefId: string) {
        const allImages = await this.storage.storage.ref(listing.imageFolderPath!).listAll();
        allImages.items.forEach(image => {
            image.delete();
        });

        await this.firestore.collection("listings").doc(dbRefId).delete();
    }

    /* Change archived property of the listing */
    async archiveListing(dbRefId: string) {
        await this.firestore.collection("listings").doc(dbRefId).update({ archived: true });
    }

    async unarchiveListing(dbRefId: string) {
        await this.firestore.collection("listings").doc(dbRefId).update({ archived: false });
    }
}