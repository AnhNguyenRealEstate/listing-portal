import { Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, doc, Firestore } from '@angular/fire/firestore';
import { updateDoc } from '@firebase/firestore';
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

    async subscribeEmailToPromotion(email: string) {
        await updateDoc(
            doc(
                this.firestore,
                `${FirestoreCollections.promotionSubscriberEmails}/emails`),
            {
                emails: arrayUnion(email)
            }
        )
    }
}