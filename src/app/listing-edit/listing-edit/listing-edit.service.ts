import { Injectable } from '@angular/core';
import { Firestore, deleteDoc, updateDoc, doc, collection } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage } from '@angular/fire/storage';
import { FirestoreCollections, ImageFileVersion } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Listing } from '../../listing-search/listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingEditService {

    constructor(
        private firestore: Firestore,
        private storage: Storage) {
    }

    /* Completely remove the listing from DB */
    async deleteListing(listing: Listing, dbRefId: string) {
        if (!environment.test) {
            const allImages = (await listAll(ref(this.storage, listing.imageFolderPath!))).prefixes;
            await Promise.all(allImages.map(async image => {
                await Promise.all(
                    [
                        deleteObject(ref(image, ImageFileVersion.compressed)),
                        deleteObject(ref(image, ImageFileVersion.raw))

                    ]
                );
            }));
        }
        await deleteDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbRefId}`));
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