import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Property, UploadedFile } from '../property-management.data';
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

    uploadForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private snackbar: MatSnackBar,
        private propertyUpload: PropertyUploadService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.property = this.data.property as Property;
        this.isEditMode = this.data.isEditMode;
    }

    ngOnInit() {
        this.uploadForm = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            category: ['', Validators.required],
            managementStartDate: ['', Validators.required],
            managementEndDate: ['', Validators.required]
        });
    }

    onFileUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            this.uploadedFiles.push(file);
        }
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
        await this.propertyUpload.editProperty(this.property, this.uploadedFiles, this.deletedFiles);

        this.snackbar.open(
            await lastValueFrom(this.translate.get('property_upload.edit_successful')),
            undefined,
            { duration: 1500 }
        );
    }
}