import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { listAll, ref, deleteObject, Storage } from '@angular/fire/storage';
import { Listing } from "./listing-card.data";
import { FirebaseStorageConsts, FirestoreCollections } from '../shared/globals';
import { I } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ListingCardService {
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async featureListing(id: string) {
        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), id),
            'featured',
            true
        );
    }

    async unfeatureListing(id: string) {
        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), id),
            'featured',
            false
        );
    }

    async deleteListing(listing: Listing) {
        if (!listing.id) {
            return;
        }

        if (environment.test) {
            await deleteDoc(doc(this.firestore, `${FirestoreCollections.listings}/${listing.id}`));
            return;
        }

        const imgsVideosStoragePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.listingImgsVideos}`
        listAll(ref(this.storage, imgsVideosStoragePath)).then(result => {
            const allImages = result.items;
            allImages.map(image => {
                deleteObject(ref(image));
            });
        })

        const coverImagePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.coverImage}`;
        deleteObject(ref(this.storage, coverImagePath));

        deleteDoc(doc(this.firestore, `${FirestoreCollections.listings}/${listing.id}`));
    }
}