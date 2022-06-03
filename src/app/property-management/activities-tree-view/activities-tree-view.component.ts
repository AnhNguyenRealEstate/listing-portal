import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Activity, UploadedFile } from '../property-management.data';

@Component({
    selector: 'activities-tree-view',
    templateUrl: 'activities-tree-view.component.html',
    styleUrls: ['./activities-tree-view.component.scss']
})

export class ActivitiesTreeviewComponent implements OnInit {
    @Input() activities: Activity[] = [];
    @Output() download: EventEmitter<UploadedFile> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {

    }

    downloadFile(doc: UploadedFile){
        this.download.emit(doc);
    }
}