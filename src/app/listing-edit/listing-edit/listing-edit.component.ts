import { Component, OnInit } from '@angular/core';
import { collection, DocumentData, Firestore, onSnapshot, query } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Listing } from '../../listing-search/listing-search.data';
import { ListingUploadDialogComponent } from '../listing-upload/listing-upload-dialog.component';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';
import { ListingEditService } from './listing-edit.service';
import { FirebaseStorageConsts, FirestoreCollections } from '../../shared/globals';
import { Unsubscribe } from '@angular/fire/auth';
import { LoadSpinnerService } from 'src/app/load-spinner/load-spinner.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'listing-edit',
    templateUrl: 'listing-edit.component.html',
    styleUrls: ['./listing-edit.component.scss']
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];
    dbReferences: string[] = [];

    files: File[] = [];
    listingToShow: Listing | undefined = undefined;
    dbReferenceId: string = "";

    snackbarMsgs!: any;

    snapshotCancel: Unsubscribe = () => { };

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        public listingEditService: ListingEditService,
        private loadingSpinnerService: LoadSpinnerService,
        private translate: TranslateService) { }

    async ngOnInit() {
        this.snapshotCancel = onSnapshot(
            query(collection(this.firestore, FirestoreCollections.listings)),
            async snapshot => {
                const listings: Listing[] = new Array<Listing>(snapshot.docs.length);
                this.dbReferences = new Array<string>(snapshot.docs.length);

                await Promise.all(snapshot.docs.map(async (doc, index) => {
                    const listing = doc.data() as Listing;
                    try {
                        listing.coverImagePath = await getDownloadURL(
                            ref(this.storage, `${listing.fireStoragePath}/${FirebaseStorageConsts.coverImage}`));
                    } catch (e) { console.log(e) }
                    finally {
                        listings[index] = listing;
                        this.dbReferences[index] = doc.id;
                    }
                }));

                this.listings = listings;
            }
        );

        this.snackbarMsgs = await this.translate.get(
            ['listing_edit.delete_msg', 'listing_edit.dismiss_msg']
        ).toPromise();
    }

    ngOnDestroy() {
        this.snapshotCancel();
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
        this.snackbar.open(
            this.snackbarMsgs['listing_edit.delete_msg'],
            this.snackbarMsgs['listing_edit.dismiss_msg'],
            {
                duration: 3000
            }
        );
    }
}