import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Activity, UploadedFile } from '../property-management.data';

@Component({
    selector: 'activities-tree-view',
    templateUrl: 'activities-tree-view.component.html',
    styleUrls: ['./activities-tree-view.component.scss']
})

export class ActivitiesTreeviewComponent implements OnInit {
    @Input() canDeleteActivities: boolean = false;
    @Input() activities: Activity[] = [];
    @Output() download: EventEmitter<UploadedFile> = new EventEmitter();
    @Output() activityRemoved: EventEmitter<number> = new EventEmitter();

    constructor(
        private renderer: Renderer2
    ) {
    }

    ngOnInit(): void {
    }

    downloadFile(doc: UploadedFile) {
        this.download.emit(doc);
    }

    showDeleteBtn(deleteBtn: HTMLDivElement) {
        this.renderer.removeStyle(deleteBtn, 'display');
    }

    hideDeleteBtn(deleteBtn: HTMLDivElement) {
        this.renderer.setStyle(deleteBtn, 'display', 'none');
    }

    removeActivity(index: number) {
        this.activityRemoved.emit(index);
    }
}