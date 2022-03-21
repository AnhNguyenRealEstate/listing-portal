import { Injectable } from '@angular/core';
import { Firestore, deleteDoc, updateDoc, doc, collection } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Listing } from '../../listing-search/listing-search.data';

@Injectable({ providedIn: 'any' })
export class ListingEditService {

    private deleteInProgress$$ = new BehaviorSubject<boolean>(false);
    private deleteInProgress$ = this.deleteInProgress$$.asObservable();

    private archiveInProgress$$ = new BehaviorSubject<boolean>(false);
    private archiveInProgress$ = this.archiveInProgress$$.asObservable();

    constructor(
        private firestore: Firestore,
        private storage: Storage) {
    }

    /* Completely remove the listing from DB */
    async deleteListing(listing: Listing, dbRefId: string) {
        this.deleteInProgress$$.next(true);

        if (!environment.test) {
            const imgsVideosStoragePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.listingImgsVideos}`
            const allImages = (await listAll(ref(this.storage, imgsVideosStoragePath))).items;
            await Promise.all(allImages.map(async image => {
                await deleteObject(ref(image))
            }));

            const coverImagePath = `${listing.fireStoragePath}/${FirebaseStorageConsts.coverImage}`
            await deleteObject(ref(this.storage, coverImagePath));
        }

        await deleteDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbRefId}`));

        this.deleteInProgress$$.next(false);
    }

    /* Change archived property of the listing */
    async archiveListing(dbRefId: string) {
        this.archiveInProgress$$.next(true);

        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), dbRefId),
            'archived',
            true
        );

        this.archiveInProgress$$.next(false);
    }

    async unarchiveListing(dbRefId: string) {
        this.archiveInProgress$$.next(true);

        await updateDoc(
            doc(collection(this.firestore, FirestoreCollections.listings), dbRefId),
            'archived',
            false
        );

        this.archiveInProgress$$.next(false);
    }

    deleteInProgress() {
        return this.deleteInProgress$;
    }

    archiveInProgress() {
        return this.archiveInProgress$;
    }
}