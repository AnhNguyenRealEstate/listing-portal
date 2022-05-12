import { Component, createNgModuleRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolesService } from '../shared/roles.service';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { Property } from './property-management.data';
import { PropertyManagementService } from './property-management.service';

@Component({
    selector: 'property-management',
    templateUrl: 'property-management.component.html'
})

export class PropertyManagementComponent implements OnInit, OnDestroy {
    numberOfMockProps = Array(3).fill(0);
    properties: Property[] = [];
    subs: Subscription = new Subscription();

    constructor(
        private dialog: MatDialog,
        private injector: Injector,
        private roles: RolesService,
        private propertyManagement: PropertyManagementService,
        private auth: Auth
    ) { }

    async ngOnInit() {
        this.subs.add(this.roles.roles$.subscribe(async roles => {
            if (roles.includes('sales')) {
                this.properties = await this.propertyManagement.getProperties();
            } else if (roles.includes('owner') && this.auth.currentUser?.email) {
                this.properties = await this.propertyManagement.getProperties(this.auth.currentUser.email);
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

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

    propertyRemoved(index: number) {
        this.properties.slice(index, 1);
    }
}