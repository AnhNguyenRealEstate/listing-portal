import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MetadataService } from 'src/app/shared/metadata.service';
import { Listing, ListingImageFile } from '../../listing-search/listing-search.data';
import { ListingUploadService } from './listing-upload.service';

@Component({
    selector: 'listing-upload-dialog',
    templateUrl: 'listing-upload-dialog.component.html',
    styleUrls: ['./listing-upload-dialog.component.scss']
})

export class ListingUploadDialogComponent implements OnInit {
    listing: Listing = {};
    dbReferenceId: string = '';

    isEditMode: boolean = false;

    locations: string[] = [];

    imageFiles: ListingImageFile[] = [];
    imageSrcs: string[] = [];
    imageFilesModified: boolean = false;

    subs: Subscription = new Subscription();
    showSpinner: boolean = false;

    snackbarMsgs!: any;

    constructor(
        private metadata: MetadataService,
        public listingUploadService: ListingUploadService,
        private snackbar: MatSnackBar,
        public dialogRef: MatDialogRef<ListingUploadDialogComponent>,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.listing = { ...this.data.listing }
        this.dbReferenceId = this.data.dbReferenceId;
        this.isEditMode = this.data.isEditMode;
    }

    async ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));

        this.snackbarMsgs = await this.translate.get(
            ['listing_upload.invalid_upload_msg',
                'listing_upload.listing_published_msg',
                'listing_upload.changes_saved_msg',
                'listing_upload.dismiss_msg']
        ).toPromise();

        if(this.listing.fireStoragePath){
            await this.listingUploadService.getListingImages(this.listing.fireStoragePath!, this.imageSrcs, this.imageFiles)
        }
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    onPurposeSelect(event: any) {
        const purpose = event.value;
        if (purpose === 'For Rent') {
            this.listing.currency = 'USD';
        } else {
            this.listing.currency = 'VND';
        }
    }

    handleImageInput(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;

            const newImageFile = {
                raw: file
            } as ListingImageFile;
            this.imageFiles.push(newImageFile);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    this.imageSrcs.push(reader.result as string)
                }
            }
        }

        this.imageFilesModified = true;
    }

    removeImage(imgSrc: string) {
        this.imageSrcs.forEach((src, index) => {
            if (src === imgSrc) {
                this.imageSrcs.splice(index, 1);
                this.imageFiles.splice(index, 1);
            }
        });

        this.imageFilesModified = true;
    }

    async publishListing() {
        if (!this.checkValidityForUpload(this.listing)) {
            this.snackbar.open(
                this.snackbarMsgs['listing_upload.invalid_upload_msg'],
                this.snackbarMsgs['listing_upload.dismiss_msg'],
                {
                    duration: 3000
                }
            );
            return;
        }

        await this.listingUploadService.publishListing(this.listing, this.imageFiles);

        this.listing = {} as Listing;
        this.imageFiles = [];
        this.imageSrcs = [];

        this.snackbar.open(
            this.snackbarMsgs['listing_upload.listing_published_msg'],
            this.snackbarMsgs['listing_upload.dismiss_msg'],
            {
                duration: 3000
            }
        );
    }

    async saveEdit() {
        if (!this.checkValidityForUpload(this.listing)) {
            this.snackbar.open(
                this.snackbarMsgs['listing_upload.invalid_upload_msg'],
                this.snackbarMsgs['listing_upload.dismiss_msg'],
                {
                    duration: 3000
                }
            );
            return;
        }

        await this.listingUploadService.saveEdit(this.listing, this.dbReferenceId, this.imageFiles, this.imageFilesModified);

        this.imageFilesModified = false;
        this.snackbar.open(
            this.snackbarMsgs['listing_upload.changes_saved_msg'],
            this.snackbarMsgs['listing_upload.dismiss_msg'],
            {
                duration: 3000
            }
        );
    }

    checkValidityForUpload(listing: Listing): boolean {
        if (listing.purpose?.length
            && listing.category?.length
            && listing.location?.length
            && !isNaN(Number(listing.bedrooms))
            && !isNaN(Number(listing.bathrooms))
            && !isNaN(Number(listing.price))
            && listing.currency?.length
            && listing.description?.length
            && this.imageFiles.length) {
            return true;
        }
        return false;
    }
}