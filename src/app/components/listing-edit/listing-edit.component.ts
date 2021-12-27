import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Listing, Locations, PropertyTypes } from '../listing-search/listing-search.data';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';

@Component({
    selector: 'app-listing-edit',
    templateUrl: 'listing-edit.component.html'
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];
    files: File[] = [];
    listingToShow: Listing | undefined = undefined;
    subs = new Subscription();

    propertyTypes = PropertyTypes;
    locations = Locations;

    constructor(
        private firestore: AngularFirestore,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.subs.add(this.firestore.collection('listings').snapshotChanges().subscribe(data => {
            const newListings = [];
            for (let i = 0; i < data.length; i++) {
                newListings.push(data[i].payload.doc.data() as Listing);
            }
            this.listings = newListings;
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showSelected(listing: Listing) {
        this.listingToShow = listing;
    }

    openAddModal() {
        // TODO: add new listing to firebase
        const config = {
            height: '100%',
            width: '100%'
        } as MatDialogConfig;
        this.dialog.open(ListingUploadComponent, config);
    }

    onPurposeSelect(event: any) {
        this.listingToShow!.purpose = event.value;
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

    }
}