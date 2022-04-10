import { Component, Inject, OnInit } from '@angular/core';
import { collection, Firestore, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Listing } from '../../listing-search/listing-search.data';
import { ListingUploadDialogComponent } from '../listing-upload/listing-upload-dialog.component';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';
import { ListingEditService } from './listing-edit.service';
import { FirestoreCollections } from '../../shared/globals';
import { Unsubscribe } from '@angular/fire/auth';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'listing-edit',
    templateUrl: 'listing-edit.component.html',
    styleUrls: ['./listing-edit.component.scss']
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];

    files: File[] = [];
    listingToShow: Listing | undefined = undefined;

    snapshotCancel: Unsubscribe = () => { };

    constructor(
        private firestore: Firestore,
        private dialog: MatDialog,
        public listingEditService: ListingEditService,
        private pageScroll: PageScrollService,
        @Inject(DOCUMENT) private document: any) { }

    async ngOnInit() {
        this.snapshotCancel = onSnapshot(
            query(collection(this.firestore, FirestoreCollections.listings), orderBy("creationDate", 'desc')),
            async snapshot => {
                const listings: Listing[] = new Array<Listing>(snapshot.docs.length);

                await Promise.all(snapshot.docs.map(async (doc, index) => {
                    const listing = doc.data() as Listing;
                    listings[index] = listing;
                }));

                this.listings = listings;
            }
        );
    }

    ngOnDestroy() {
        this.snapshotCancel();
    }

    showSelected(listing: Listing) {
        this.listingToShow = listing;
    }

    showSelectedAsDialog(listing: Listing) {
        this.listingToShow = listing;
        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: listing,
                dbReferenceId: this.listingToShow.id!,
                isEditMode: true
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadDialogComponent, config);
    }

    openUploadModalDesktop() {
        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: undefined
            }
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

    cloneListing(listingToClone: Listing) {
        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: listingToClone
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadComponent, config);
    }

    cloneListingMobile(listingToClone: Listing) {
        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: listingToClone,
                dbReferenceId: '',
                isEditMode: false
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadDialogComponent, config);
    }

    scrollTop() {
        this.pageScroll.scroll({
            document: this.document,
            scrollTarget: '.navbar',
            duration: 250
        });
    }
}