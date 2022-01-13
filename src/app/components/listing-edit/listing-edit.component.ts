import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Listing, Locations, PropertyTypes } from '../listing-search/listing-search.data';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';
import { LoadingSpinnerService } from '../load-spinner/loading-spinner.service';
import { ListingEditService } from './listing-edit.service';

@Component({
    selector: 'app-listing-edit',
    templateUrl: 'listing-edit.component.html'
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];
    dbReferences: string[] = [];

    files: File[] = [];
    listingToShow: Listing | undefined = undefined;
    dbReferenceId: string = "";

    subs = new Subscription();

    propertyTypes = PropertyTypes;
    locations = Locations;

    constructor(
        private firestore: AngularFirestore,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private listingEditService: ListingEditService,
        private loadingSpinnerService: LoadingSpinnerService) { }

    ngOnInit() {
        this.subs.add(this.firestore.collection('listings').snapshotChanges().subscribe(data => {
            const listings = [];
            for (let i = 0; i < data.length; i++) {
                const doc = data[i].payload.doc;
                const listing = doc.data() as Listing;
                listings.push(listing);
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
        this.dbReferenceId = this.dbReferences[index];
    }

    openUploadModal() {
        const config = {
            height: '100%',
            width: '100%'
        } as MatDialogConfig;
        this.dialog.open(ListingUploadComponent, config);
    }

    /* Change archived property of the listing */
    async archiveListing() {
        //TODO
    }

    /* Completely remove the listing from DB */
    async deleteListing(index: number) {
        this.loadingSpinnerService.startLoadingSpinner();
        console.log(`Deleting listing with address ${this.listings[index].address} and image folder ${this.listings[index].imageFolderPath}`);
        await this.listingEditService.deleteListing(this.listings[index], this.dbReferences[index]);
        this.listingToShow = undefined;

        this.loadingSpinnerService.stopLoadingSpinner();
        this.snackbar.open("Listing deleted 🗑", "Dismiss", {
            duration: 3000
        })
    }
}