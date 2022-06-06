import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from 'src/app/shared/roles.service';
import { Property, UploadedFile } from '../property-management.data';
import { PropertyDetailsService } from './property-details.service';

@Component({
    selector: 'property-details',
    templateUrl: 'property-details.component.html',
    styleUrls: ['./property-details.component.scss']
})

export class PropertyDetailsComponent implements OnInit {
    property!: Property;

    constructor(
        private propertyDetails: PropertyDetailsService,
        public roles: RolesService,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.property = this.data.property;
    }

    ngOnInit() { }

    async downloadDoc(doc: UploadedFile) {
        const file = await this.propertyDetails.downloadDoc(`${this.property.fileStoragePath}/${doc.dbHashedName}`);
        const url = window.URL.createObjectURL(file);
        window.open(url);
    }

    timestampToDate(stamp: any): Date {
        return new Date((stamp as any).seconds * 1000);
    }
}