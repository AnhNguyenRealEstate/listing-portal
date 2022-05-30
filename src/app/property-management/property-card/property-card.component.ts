import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Property } from '../property-management.data';
import { PropertyUploadComponent } from '../property-upload/property-upload.component';
import { PropertyCardService } from './property-card.service';

@Component({
    selector: 'property-card',
    templateUrl: 'property-card.component.html',
    styleUrls: ['./property-card.component.scss']
})

export class PropertyCardComponent implements OnInit {
    @Input() property!: Property;
    @Output() delete = new EventEmitter();

    @ViewChild('confirmationDialog') confirmationDialogTemplate!: TemplateRef<string>;

    constructor(
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private translate: TranslateService,
        private propertyCard: PropertyCardService
    ) { }

    ngOnInit(): void {
        this.property.managementStartDate = new Date((this.property.managementStartDate! as any).seconds * 1000);
        this.property.managementEndDate = new Date((this.property.managementEndDate! as any).seconds * 1000);
    }

    async editProperty(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                property: this.property,
                isEditMode: true
            }
        } as MatDialogConfig;

        this.dialog.open(PropertyUploadComponent, config);
    }

    async deleteProperty(event: Event) {
        event.stopPropagation();

        this.dialog.open(this.confirmationDialogTemplate, {
            height: '20%',
            width: '100%'
        }).afterClosed().subscribe((toDelete: boolean) => {
            if (toDelete) {
                this.propertyCard.deleteProperty(this.property);
                this.delete.emit();

                this.snackbar.open(
                    this.translate.instant('property_card.delete_msg'),
                    this.translate.instant('property_card.dismiss_msg'),
                    {
                        duration: 3000
                    }
                );
            }
        });
    }
}