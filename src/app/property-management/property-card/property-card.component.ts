import { Component, createNgModuleRef, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Property } from '../property-management.data';
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
        private propertyCard: PropertyCardService,
        private injector: Injector
    ) { }

    ngOnInit() {

    }

    async editProperty(property: Property) {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                property: property,
                isEditMode: true
            }
        } as MatDialogConfig;

        const { PropertyUploadModule } = await import("src/app/property-management/property-upload/property-upload.module");
        const moduleRef = createNgModuleRef(PropertyUploadModule, this.injector);
        const listingUploadComponent = moduleRef.instance.getPropertyUploadModule();

        this.dialog.open(listingUploadComponent, config);
    }
    
    async deleteListing(event: Event) {
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