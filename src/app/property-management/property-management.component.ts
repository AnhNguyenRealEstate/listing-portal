import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolesService } from '../shared/roles.service';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { Property } from './property-management.data';
import { PropertyManagementService } from './property-management.service';
import { PropertyUploadComponent } from './property-upload/property-upload.component';

@Component({
    selector: 'property-management',
    templateUrl: 'property-management.component.html',
    styleUrls: ['./property-management.component.scss']
})

export class PropertyManagementComponent implements OnInit, OnDestroy {
    numberOfMockProps = Array(3).fill(0);
    properties: Property[] = [];
    subs: Subscription = new Subscription();

    constructor(
        private dialog: MatDialog,
        public roles: RolesService,
        private propertyManagement: PropertyManagementService,
        private auth: Auth
    ) { }

    async ngOnInit() {
        this.subs.add(this.roles.roles$.subscribe(async roles => {
            if (roles.includes('customer-service')) {
                this.properties = await this.propertyManagement.getProperties();
            } else if (roles.includes('owner') && this.auth.currentUser?.email) {
                this.properties = await this.propertyManagement.getProperties(this.auth.currentUser.email);
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showDetails(property: Property) {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                property: property
            }
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

        this.dialog.open(PropertyUploadComponent, config);
    }

    propertyRemoved(index: number) {
        this.properties.splice(index, 1);
    }
}