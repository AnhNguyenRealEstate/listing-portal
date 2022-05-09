import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { FirestoreCollections } from '../shared/globals';
import { Property } from './property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyManagementService {
    constructor(
        private firestore: Firestore
    ) { }

    async getProperties(owner: string): Promise<Property[]> {
        const result = await getDocs(query(
            collection(this.firestore, FirestoreCollections.underManagement),
            where("owner", "==", owner))
        );
        
        return result.docs.map(doc => {
            return doc.data() as Property;
        });
    }
}