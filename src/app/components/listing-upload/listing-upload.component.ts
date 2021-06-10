import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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

    files: File[] = [];

    constructor(
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private dialog: MatDialog) { }

    ngOnInit() {
        const authSub = this.auth.user.subscribe(user => {
            if (user && user.email) {
                this.loggedIn = true;
                authSub.unsubscribe();
            } else {
                const config = {
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
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            this.files.push((event.target.files as FileList).item(i)!);
        }
    }

    submit() {
        const date = new Date();
        const imageFolderName = `${this.listing.location}-${date.getMonth()}${date.getDate()}-${date.getHours()}${date.getMinutes()}`;
        this.files.forEach((file, index) => {
            this.storage.ref(`listing-images/${imageFolderName}/${index}`).put(file);
        });
        this.listing.imageSources = [`listing-images/${imageFolderName}`];
        this.firestore.collection('listings').add(this.listing);
        this.listing = {} as Listing;
    }
}