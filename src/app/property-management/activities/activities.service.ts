import { Injectable } from '@angular/core';
import { collectionGroup, Firestore, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { FirestoreCollections } from 'src/app/shared/globals';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async getActivities(owner?: string) {
        let q = query(
            collectionGroup(this.firestore, FirestoreCollections.activities),
            orderBy('date', 'desc')
        );

        if (owner) {
            q = query(q, where('owner', '==', owner));
        }

        return await getDocs(q);
    }
}