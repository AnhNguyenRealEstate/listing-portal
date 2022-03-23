import { Component, Input, OnInit } from '@angular/core';
import { Recipient, Report } from '../employee-reporting.data';

@Component({
    selector: 'report-upload',
    templateUrl: 'report-upload.component.html',
    styleUrls: ['./report-upload.component.scss']
})

export class ReportUploadComponent implements OnInit {
    @Input() report: Report = {} as Report;
    @Input() isEditMode = false;

    reportDate: string = '';

    recipients: Recipient[] = [];
    
    constructor() { }

    ngOnInit() { }
}