import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Listing, Locations, PropertySizes, PropertyTypes } from '../listing-search/listing-search.data';
import { LoginComponent } from '../login/login-dialog.component';

@Component({
    selector: 'app-listing-upload',
    templateUrl: 'listing-upload.component.html'
})

export class ListingUploadComponent implements OnInit {
    loggedIn: boolean = false;
    listing: Listing = {} as Listing;
    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    constructor(
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
        private dialog: MatDialog) { }

    ngOnInit() {
        const authSub = this.auth.user.subscribe(user => {
            if (user && user.email) {
                this.loggedIn = true;
                authSub.unsubscribe();
            } else {
                const config = {
                    position: {
                        bottom: '10em'
                    } as DialogPosition,
                    height: 'auto',
                    width: 'auto',
                    disableClose: true,
                    scrollStrategy: new NoopScrollStrategy()
                } as MatDialogConfig;
                this.dialog.open(LoginComponent, config);
            }
        });
    }

    handleImageInput(event: any) {
    }

    submit() {
        return;
        this.firestore.collection('listings').add(this.listing);
    }
}