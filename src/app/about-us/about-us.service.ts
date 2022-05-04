import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FirestoreCollections, FirestoreDocs } from '../shared/globals';
import { Inquiry } from './about-us.data';

@Injectable({ providedIn: 'root' })
export class AboutUsService {
    constructor(
        private firestore: Firestore
    ) { }

    async submitInquiry(inquiry: Inquiry) {
        await addDoc(collection(this.firestore, FirestoreCollections.inquiries), inquiry);
    }
}