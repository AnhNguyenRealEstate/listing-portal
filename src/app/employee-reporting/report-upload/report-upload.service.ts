import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreCollections } from 'src/app/shared/globals';
import { Report } from '../employee-reporting.data';

@Injectable({ providedIn: 'any' })
export class ReportUploadService {

    private uploadInProgress$$ = new BehaviorSubject<boolean>(false);
    uploadInProgress$ = this.uploadInProgress$$.asObservable();

    constructor(
        private firestore: Firestore
    ) { }

    async uploadReport(report: Report) {
        this.uploadInProgress$$.next(true);
        await addDoc(
            collection(this.firestore, FirestoreCollections.employeeReports),
            report
        );
        this.uploadInProgress$$.next(false);
    }

    async editReport(report: Report) {
        this.uploadInProgress$$.next(true);
        await updateDoc(
            doc(this.firestore, `${FirestoreCollections.employeeReports}/${report.id}`),
            { ...report }
        );
        this.uploadInProgress$$.next(false);
    }
}