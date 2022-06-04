import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Activity, Property, UploadedFile } from '../property-management.data';
import { PropertyUploadService } from './property-upload.service';

@Component({
    selector: 'property-upload',
    templateUrl: 'property-upload.component.html',
    styleUrls: ['./property-upload.component.scss']
})

export class PropertyUploadComponent implements OnInit {
    property: Property = {} as Property;
    isEditMode: boolean = false;

    uploadedFiles: File[] = [];
    deletedFiles: UploadedFile[] = [];
    deletedActivities: Activity[] = [];

    managementStartDate!: Date | undefined;
    managementEndDate!: Date | undefined;

    constructor(
        private translate: TranslateService,
        private snackbar: MatSnackBar,
        private propertyUpload: PropertyUploadService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.property = this.data.property as Property;
        this.isEditMode = this.data.isEditMode;
    }

    ngOnInit() {
        this.managementStartDate = this.property.managementStartDate?.toDate();
        this.managementEndDate = this.property.managementEndDate?.toDate();
    }

    onFileUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        const newFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;

            if (this.property.documents?.length
                && this.property.documents.find(doc => doc.displayName === file.name)) {
                continue;
            }

            newFiles.unshift(file);
            this.uploadedFiles.unshift(file);
        }

        if (!this.property.documents?.length) {
            this.property.documents = [];
        }

        this.property.documents.unshift(...newFiles.map(file => {
            return {
                displayName: file.name,
                dbHashedName: this.generateHash(file.name)
            } as UploadedFile
        }))

    }

    onFileRemove(index: number) {
        const deletedFile = this.property.documents!.splice(index, 1);
        this.deletedFiles.push(deletedFile[0]);
    }

    async upload() {
        await this.propertyUpload.uploadProperty(this.property, this.uploadedFiles);

        this.snackbar.open(
            await lastValueFrom(this.translate.get('property_upload.upload_successful')),
            undefined,
            { duration: 1500 }
        );
    }

    async edit() {
        await this.propertyUpload.editProperty(this.property, this.uploadedFiles, this.deletedFiles, this.deletedActivities);

        this.snackbar.open(
            await lastValueFrom(this.translate.get('property_upload.edit_successful')),
            undefined,
            { duration: 1500 }
        );
    }

    uploadedFileDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.property.documents!, event.previousIndex, event.currentIndex);
    }

    private generateHash(str: string, seed?: number) {
        //https://www.codegrepper.com/code-examples/javascript/hash+a+string+angular
        /*jshint bitwise:false */
        let i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;
        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substring(-8);
    }

    doesFileNameAlreadyExist(name: string) {
        return !!this.property.documents?.find(doc => doc.displayName === name);
    }

    dateToTimestamp(date: Date): Timestamp {
        return Timestamp.fromDate(date);
    }

    onActivityRemove(index: number) {
        if (!this.property.activities?.length) {
            return;
        }

        const removed = this.property.activities!.splice(index, 1);
        this.deletedActivities.push(...removed);
    }
}