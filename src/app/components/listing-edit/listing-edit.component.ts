import { Component, OnInit } from '@angular/core';
import { collection, DocumentData, Firestore, onSnapshot } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Listing } from '../listing-search/listing-search.data';
import { ListingUploadDialogComponent } from '../listing-upload/listing-upload-dialog.component';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';
import { LoadSpinnerService } from '../load-spinner/loading-spinner.service';
import { ListingEditService } from './listing-edit.service';
import { FirestoreCollections, ImageFileVersion } from '../../shared/globals';

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
        private firestore: Firestore,
        private storage: Storage,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private listingEditService: ListingEditService,
        private loadingSpinnerService: LoadSpinnerService) { }

    ngOnInit() {
        this.subs.add(onSnapshot(collection(this.firestore, FirestoreCollections.listings), async data => {
            const listings: Listing[] = [];
            this.dbReferences = [];

            for (let i = 0; i < data.docs.length; i++) {
                const doc: DocumentData = data.docs[i];
                const listing = doc.data() as Listing;
                listing.coverImage = await getDownloadURL(ref(this.storage, `${listing.imageFolderPath}/0/${ImageFileVersion.compressed}`));
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

        this.loadingSpinnerService.start();
        await this.listingEditService.archiveListing(this.dbReferences[index]);
        this.loadingSpinnerService.stop();
    }

    async unarchiveListing(event: Event, index: number) {
        event.stopPropagation();

        this.loadingSpinnerService.start();
        await this.listingEditService.unarchiveListing(this.dbReferences[index]);
        this.loadingSpinnerService.stop();
    }

    /* Completely remove the listing from DB */
    async deleteListing(event: Event, index: number) {
        event.stopPropagation();

        this.loadingSpinnerService.start();

        await this.listingEditService.deleteListing(this.listings[index], this.dbReferences[index]);
        this.listingToShow = undefined;
        this.dbReferenceId = '';

        this.loadingSpinnerService.stop();
        this.snackbar.open("Listing deleted 🗑", "Dismiss", {
            duration: 3000
        })
    }
}