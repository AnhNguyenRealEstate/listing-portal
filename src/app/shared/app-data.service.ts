import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppDataService {
    private _propertyTypes$$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private _locations$$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    constructor(private firestore: AngularFirestore) {
        const listingDataDoc = this.firestore.collection('app-data').doc('listing-data');
        listingDataDoc.snapshotChanges().subscribe(dbResponse => {
            const appData = dbResponse.payload.data() as any;

            const propertyTypes = appData["property-types"];
            if (propertyTypes?.length) {
                this._propertyTypes$$.next(propertyTypes);
            }

            const locations = appData["locations"];
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