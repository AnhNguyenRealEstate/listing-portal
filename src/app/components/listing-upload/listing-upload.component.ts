import { Component } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Listing, Locations, PropertyTypes } from '../listing-search/listing-search.data';

@Component({
    selector: 'app-listing-upload',
    templateUrl: 'listing-upload.component.html'
})

export class ListingUploadComponent {
    listing: Listing = {} as Listing;
    propertyTypes = PropertyTypes;
    locations = Locations;

    files: File[] = [];

    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
    ) { }

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

        for (let i = 0; i < this.files.length; i++) {
            this.storage.ref(`listing-images/${imageFolderName}/${i}`)
                .put(this.files[i]).catch(error => console.log(error));
        }

        this.listing.imageFolderPath = `listing-images/${imageFolderName}`;
        this.firestore.collection('listings').add(this.listing).catch(error => console.log(error));
        this.listing = {} as Listing;
    }
}