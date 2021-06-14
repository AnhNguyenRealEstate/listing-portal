import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Listing, Locations, PropertyTypes } from '../listing-search/listing-search.data';
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

    files: File[] = [];

    constructor(
        private auth: AngularFireAuth,
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private dialog: MatDialog) { }

    ngOnInit() {
        const authSub = this.auth.user.subscribe(user => {
            if (user?.email) {
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

    onPurposeSelect(event: any) {
        this.listing.purpose = event.value;
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
        const imageFolderName = 
        `${this.listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;

        this.files.forEach((file, index) => {
            this.storage.ref(`listing-images/${imageFolderName}/${index}`).put(file);
        });
        
        this.listing.imageFolderPath = `listing-images/${imageFolderName}`;
        this.firestore.collection('listings').add(this.listing);
        this.listing = {} as Listing;
    }
}