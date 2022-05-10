import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, limit, query, where } from '@angular/fire/firestore';
import { FirestoreCollections } from '../shared/globals';
import { Property } from './property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyManagementService {
    private quotaPerQuery = 6;

    constructor(
        private firestore: Firestore
    ) { }


    async getProperties(): Promise<Property[]>;
    async getProperties(owner?: string): Promise<Property[]> {
        let q = query(collection(this.firestore, FirestoreCollections.underManagement), limit(this.quotaPerQuery));

        if (owner) {
            q = query(q, (where("owner", "==", owner)));
        }

        const result = await getDocs(q);

        return result.docs.map(doc => {
            return doc.data() as Property;
        });
    }
}