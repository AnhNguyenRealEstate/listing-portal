import { Injectable } from '@angular/core';
import { deleteDoc, updateDoc, doc, Firestore } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { Activity, Property } from '../property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyCardService {
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    deleteProperty(property: Property) {
        if (!property.id) {
            return;
        }

        const fileStoragePath = property.fileStoragePath!;
        listAll(ref(this.storage, fileStoragePath)).then(result => {
            const allFiles = result.items;
            allFiles.map(file => {
                deleteObject(ref(file));
            });
        });

        deleteDoc(doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`));
    }

    async addActivity(property: Property, activity: Activity, newFiles: File[]) {
        // Only under extreme usage that there could be hash collision
        // Highly unlikely to happen

        if (property.activities?.length) {
            property.activities.unshift(activity);
        } else {
            property.activities = [];
            property.activities.unshift(activity);
        }


        await updateDoc(doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`), { ...property });

        await Promise.all(newFiles.map(async file => {
            const hashedName = activity.documents!.find(document => document.displayName === file.name)?.dbHashedName;
            if (!hashedName) {
                return;
            }

            const fileStoragePath = `${property.fileStoragePath}/${hashedName}`;
            await uploadBytes(
                ref(
                    this.storage,
                    `${fileStoragePath}`
                ),
                file
            ).catch()
        }));
    }
}