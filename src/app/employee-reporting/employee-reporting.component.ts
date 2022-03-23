import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, DocumentData, Firestore, limit, onSnapshot, orderBy, query, QueryConstraint, Unsubscribe } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreCollections } from '../shared/globals';
import { Report } from './employee-reporting.data';
import { ReportUploadComponent } from './report-upload/report-upload.component';

@Component({
    selector: 'employee-reporting',
    templateUrl: 'employee-reporting.component.html',
    styleUrls: ['./employee-reporting.component.scss']
})

export class EmployeeReportingComponent implements OnInit {
    reports: Report[] = [];
    employeeReports: Report[] = [];

    snapshotCancel: Unsubscribe = () => { };

    constructor(
        private firestore: Firestore,
        private auth: Auth,
        private dialog: MatDialog,
        private snackbar: MatSnackBar) { }

    async ngOnInit() {
        this.snapshotCancel = onSnapshot(
            query(
                collection(this.firestore, FirestoreCollections.employeeReports),
                orderBy('reportDate', 'desc'),
                limit(30)
            ),
            async snapshot => {
                const reports: Report[] = [];
                const employeeReports: Report[] = [];

                for (let i = 0; i < snapshot.docs.length; i++) {
                    const doc: DocumentData = snapshot.docs[i];
                    const report = doc.data() as Report;
                    report.id = doc.id;

                    if (this.auth.currentUser?.email === report.author) {
                        reports.push(report);
                    }

                    const isEmployeeReport = report.recipients?.find(
                        recipient => recipient === this.auth.currentUser?.email
                    );
                    if (isEmployeeReport) {
                        employeeReports.push(report);
                    }
                }

                this.reports = reports;
                this.employeeReports = employeeReports;
            }
        );
    }

    openReportUploadDesktop() {
        const config = {
            height: '90%',
            width: '100%'
        } as MatDialogConfig;
        this.dialog.open(ReportUploadComponent, config);
    }

    openReportUploadMpbile() {

    }

    showSelected(report: Report) {

    }

    showSelectedAsDialog(report: Report) {

    }
}