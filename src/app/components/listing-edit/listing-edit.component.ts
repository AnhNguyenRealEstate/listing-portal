import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Listing } from '../listing-search/listing-search.data';
import { ListingUploadDialogComponent } from '../listing-upload/listing-upload-dialog.component';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';
import { LoadingSpinnerService } from '../load-spinner/loading-spinner.service';
import { ListingEditService } from './listing-edit.service';

@Component({
    selector: 'app-listing-edit',
    templateUrl: 'listing-edit.component.html',
    styleUrls: ['./listing-edit.component.scss']
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];
    dbReferences: string[] = [];

    files: File[] = [];
    listingToShow: Listing | undefined = undefined;
    dbReferenceId: string = "";

    subs = new Subscription();

    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private listingEditService: ListingEditService,
        private loadingSpinnerService: LoadingSpinnerService) { }

    ngOnInit() {
        this.subs.add(this.firestore.collection('listings').snapshotChanges().subscribe(async data => {
            const listings: Listing[] = [];
            this.dbReferences = [];

            for (let i = 0; i < data.length; i++) {
                const doc = data[i].payload.doc;
                const listing = doc.data() as Listing;
                listing.coverImage = await this.storage.storage.ref(`${listing.imageFolderPath}/0`).getDownloadURL();
                listings.push(listing);
                this.dbReferences.push(doc.id);
            }

            this.listings = listings; //Updating the listings all at once
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showSelected(listing: Listing, index: number) {
        this.listingToShow = listing;
        this.dbReferenceId = this.dbReferences[index];
    }

    showSelectedAsDialog(listing: Listing, index: number) {
        this.listingToShow = listing;
        this.dbReferenceId = this.dbReferences[index];
        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: listing,
                dbReferenceId: this.dbReferenceId,
                isEditMode: true
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadDialogComponent, config);
    }

    openUploadModalDesktop() {
        const config = {
            height: '90%',
            width: '100%'
        } as MatDialogConfig;
        this.dialog.open(ListingUploadComponent, config);
    }

    openUploadModalMobile() {
        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: {} as Listing,
                dbReferenceId: '',
                isEditMode: false
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadDialogComponent, config);
    }

    async archiveListing(event: Event, index: number) {
        event.stopPropagation();

        this.loadingSpinnerService.startLoadingSpinner();
        await this.listingEditService.archiveListing(this.dbReferences[index]);
        this.loadingSpinnerService.stopLoadingSpinner();
    }

    async unarchiveListing(event: Event, index: number) {
        event.stopPropagation();

        this.loadingSpinnerService.startLoadingSpinner();
        await this.listingEditService.unarchiveListing(this.dbReferences[index]);
        this.loadingSpinnerService.stopLoadingSpinner();
    }

    /* Completely remove the listing from DB */
    async deleteListing(event: Event, index: number) {
        event.stopPropagation();

        this.loadingSpinnerService.startLoadingSpinner();
        //console.log(`Deleting listing with address ${this.listings[index].address} and image folder ${this.listings[index].imageFolderPath}`);
        await this.listingEditService.deleteListing(this.listings[index], this.dbReferences[index]);
        this.listingToShow = undefined;
        this.dbReferenceId = '';

        this.loadingSpinnerService.stopLoadingSpinner();
        this.snackbar.open("Listing deleted 🗑", "Dismiss", {
            duration: 3000
        })
    }
}