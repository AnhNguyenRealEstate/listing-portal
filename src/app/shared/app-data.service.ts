import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreCollections, FirestoreDocs } from './globals';

@Injectable({ providedIn: 'root' })
export class MetadataService {
    private _propertyTypes$$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private _locations$$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    public metadataKeys = Object.freeze({
        propertyTypes: "property-types",
        locations: "locations"
    });

    constructor(private firestore: AngularFirestore) {
        const listingDataDoc = this.firestore.collection(FirestoreCollections.metadata).doc(FirestoreDocs.listingMetadata);
        listingDataDoc.snapshotChanges().subscribe(dbResponse => {
            const metadata = dbResponse.payload.data() as any;

            const propertyTypes = metadata[this.metadataKeys.propertyTypes];
            if (propertyTypes?.length) {
                this._propertyTypes$$.next(propertyTypes);
            }

            const locations = metadata[this.metadataKeys.locations];
            if (locations?.length) {
                this._locations$$.next(locations);
            }
        })
    }

    propertyTypes(): Observable<string[]> {
        return this._propertyTypes$$.asObservable();
    }

    locations(): Observable<string[]> {
        return this._locations$$.asObservable();
    }
}