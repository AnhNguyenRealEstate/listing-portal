import { Component, createNgModuleRef, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { Property } from './property-management.data';

@Component({
    selector: 'property-management',
    templateUrl: 'property-management.component.html'
})

export class PropertyManagementComponent implements OnInit {
    numberOfMockProps = Array(3).fill(0);

    constructor(
        private dialog: MatDialog,
        private injector: Injector
    ) { }

    ngOnInit() { }

    showDetails() {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false
        } as MatDialogConfig;
        this.dialog.open(PropertyDetailsComponent, config);
    }

    async addProperty() {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                property: {} as Property,
                isEditMode: false
            }
        } as MatDialogConfig;

        const { PropertyUploadModule } = await import("src/app/property-management/property-upload/property-upload.module");
        const moduleRef = createNgModuleRef(PropertyUploadModule, this.injector);
        const listingUploadComponent = moduleRef.instance.getPropertyUploadModule();

        this.dialog.open(listingUploadComponent, config);
    }
}