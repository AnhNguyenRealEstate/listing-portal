import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { listAll, ref, deleteObject, Storage } from '@angular/fire/storage';
import { httpsCallableFromURL, httpsCallable, getFunctions } from '@angular/fire/functions';
import { getApp } from '@angular/fire/app'
import { Listing } from "./listing-card.data";
import { FirebaseStorageConsts, FirestoreCollections } from '../shared/globals';
import { environment } from 'src/environments/environment';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Injectable({ providedIn: 'root' })
export class ListingCardService {
    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private snackbar: MatSnackBar
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

    async createGooglePost(listingId: string) {
        const functions = getFunctions(getApp(), 'asia-southeast1')
        const _createGooglePost = httpsCallable(functions, 'listing-createGooglePost')
        await _createGooglePost({ listingId: listingId })
        this.snackbar.open('Created Google post', 'Dismiss', { duration: 3000 })
    }
}