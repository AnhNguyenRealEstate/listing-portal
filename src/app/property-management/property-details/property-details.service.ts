import { Injectable } from '@angular/core';
import { updateDoc, doc, Firestore, deleteDoc, collection, DocumentSnapshot, getDocs, limit, query, startAfter } from '@angular/fire/firestore';
import { deleteObject, getBlob, ref, Storage } from '@angular/fire/storage';
import { FirestoreCollections } from 'src/app/shared/globals';
import { Property, Activity } from '../property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyDetailsService {
    private initialNumOfActivities = 10;

    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async downloadDoc(docPath: string): Promise<Blob> {
        return await getBlob(ref(this.storage, `${docPath}`));
    }

    async getActivities(property: Property) {
        const snapshot = await getDocs(
            query(
                collection(
                    doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`),
                    'activities'
                ),
                limit(this.initialNumOfActivities)
            )
        );
        return snapshot;
    }

    async getMoreActivities(property: Property, lastResult: DocumentSnapshot) {
        const snapshot = await getDocs(
            query(
                collection(
                    doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`),
                    'activities'
                ),
                startAfter(lastResult),
                limit(this.initialNumOfActivities)
            )
        );

        return snapshot;
    }
}