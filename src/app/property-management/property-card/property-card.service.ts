import { Injectable } from '@angular/core';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage } from '@angular/fire/storage';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { Property } from '../property-management.data';

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
}