import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Listing, Locations, PropertyTypes } from '../listing-search/listing-search.data';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-listing-edit',
    templateUrl: 'listing-edit.component.html'
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];
    dbReferences: string[] = [];

    files: File[] = [];
    listingToShow: Listing | undefined = undefined;
    currentReferenceId: string = "";

    subs = new Subscription();

    propertyTypes = PropertyTypes;
    locations = Locations;

    constructor(
        private firestore: AngularFirestore,
        private dialog: MatDialog,
        private snackbar: MatSnackBar) { }

    ngOnInit() {
        this.subs.add(this.firestore.collection('listings').snapshotChanges().subscribe(data => {
            const listings = [];
            for (let i = 0; i < data.length; i++) {
                const doc = data[i].payload.doc;
                listings.push(doc.data() as Listing);
                this.dbReferences.push(doc.id);
            }
            this.listings = listings;
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showSelected(listing: Listing, index: number) {
        this.listingToShow = listing;
        this.currentReferenceId = this.dbReferences[index];
    }

    openAddModal() {
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

    async submit() {
        if (!this.listingToShow) {
            return;
        }

        await this.firestore.collection("listings").doc(this.currentReferenceId).update(this.listingToShow!);
        this.snackbar.open("Changes saved ✅", "Dismiss", {
            duration: 3000
        })
    }
}