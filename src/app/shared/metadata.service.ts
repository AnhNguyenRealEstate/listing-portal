import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, onSnapshot } from '@angular/fire/firestore';
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

    constructor(private firestore: Firestore) {
        const listingMetadataDoc = doc(collection(this.firestore, FirestoreCollections.metadata), FirestoreDocs.listingMetadata);
        onSnapshot(listingMetadataDoc, dbResponse => {
            const metadata = dbResponse.data() as any;

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