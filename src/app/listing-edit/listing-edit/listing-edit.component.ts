import { Component, Inject, OnInit } from '@angular/core';
import { onSnapshot } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Listing } from '../../listing-search/listing-search.data';
import { ListingEditService } from './listing-edit.service';
import { Unsubscribe } from '@angular/fire/auth';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { ListingUploadDialogComponent } from 'src/app/listing-upload/listing-upload-dialog.component';
import { ListingUploadComponent } from 'src/app/listing-upload/listing-upload.component';

@Component({
    selector: 'listing-edit',
    templateUrl: 'listing-edit.component.html',
    styleUrls: ['./listing-edit.component.scss']
})

export class ListingEditComponent implements OnInit {
    listings: Listing[] = [];

    files: File[] = [];
    listingToShow: Listing | undefined = undefined;

    isLoadingMore = false;
    noMoreToLoad = false;

    snapshotCancel: Unsubscribe = () => { };

    constructor(
        private dialog: MatDialog,
        public listingEditService: ListingEditService,
        private pageScroll: PageScrollService,
        @Inject(DOCUMENT) private document: any) { }

    async ngOnInit() {
        this.snapshotCancel = onSnapshot(
            this.listingEditService.queryListingsByCreationDateDesc(),
            async snapshot => {
                const snapshotDocs = snapshot.docs;
                const listings: Listing[] = new Array<Listing>(snapshotDocs.length);

                this.listingEditService.setLastResultOfPagination(snapshotDocs[snapshotDocs.length - 1]);

                await Promise.all(snapshotDocs.map(async (doc, index) => {
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
            autoFocus: false,
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
            autoFocus: false,
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
            autoFocus: false,
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
            autoFocus: false,
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
            autoFocus: false,
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

    async loadMore() {
        this.isLoadingMore = true;

        const results = await this.listingEditService.getMoreListings();
        if (!results.length) {
            this.isLoadingMore = false;
            this.noMoreToLoad = true;
            return;
        }

        this.listings.push(...results);

        this.isLoadingMore = false;
    }
}