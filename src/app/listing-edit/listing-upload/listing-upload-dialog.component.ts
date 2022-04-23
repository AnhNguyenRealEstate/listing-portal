import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject, lastValueFrom, Observable, Subscription } from 'rxjs';
import { FirebaseStorageConsts } from 'src/app/shared/globals';
import { MetadataService } from 'src/app/shared/metadata.service';
import { Listing, ListingImageFile } from '../../listing-search/listing-search.data';
import { AvailableContactChannels } from './listing-upload.data';
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
    filteredLocations$$ = new BehaviorSubject<string[]>([]);
    filteredLocations$: Observable<string[]> = this.filteredLocations$$.asObservable();

    imageFiles: ListingImageFile[] = [];
    imageSrcs: string[] = [];
    imageFilesModified: boolean = false;
    compressionInProgress: boolean = false;

    coverImageFile: File | undefined = undefined;
    coverImageSrc: string | undefined = undefined;
    coverImageModified: boolean = false;
    coverImageEditRequested: boolean = false;
    gettingCoverImage: boolean = false;

    subs: Subscription = new Subscription();

    mediaEditRequested: boolean = false;
    gettingMedia: boolean = false;

    snackbarMsgs!: any;

    AvailableContactChannels = AvailableContactChannels;

    constructor(
        private metadata: MetadataService,
        public listingUploadService: ListingUploadService,
        private imageCompress: NgxImageCompressService,
        private snackbar: MatSnackBar,
        public dialogRef: MatDialogRef<ListingUploadDialogComponent>,
        private translate: TranslateService,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.listing = { ...this.data.listing }
        this.dbReferenceId = this.data.dbReferenceId;
        this.isEditMode = this.data.isEditMode;
    }

    async ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
            this.updateOptions();
        }));

        this.snackbarMsgs = await lastValueFrom(this.translate.get(
            ['listing_upload.invalid_upload_msg',
                'listing_upload.listing_published_msg',
                'listing_upload.changes_saved_msg',
                'listing_upload.dismiss_msg']
        ));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    async onEditCoverImage() {
        this.gettingCoverImage = true;

        const coverImagePath = `${this.listing.fireStoragePath}/${FirebaseStorageConsts.coverImage}`;
        this.coverImageFile = await this.listingUploadService.getListingCoverImage(coverImagePath);

        const reader = new FileReader();
        reader.readAsDataURL(this.coverImageFile);
        reader.onloadend = () => {
            this.coverImageSrc = reader.result as string;
        }

        this.gettingCoverImage = false;
        this.coverImageEditRequested = true;
    }

    async onEditMedia() {
        this.gettingMedia = true;
        await this.listingUploadService.getListingImages(
            this.listing.fireStoragePath!, this.imageSrcs, this.imageFiles
        );
        this.gettingMedia = false;
        this.mediaEditRequested = true;
    }

    onPurposeSelect(event: any) {
        const purpose = event.value;
        if (purpose === 'For Rent') {
            this.listing.currency = 'USD';
        } else {
            this.listing.currency = 'VND';
        }
    }

    async onMediaUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        this.compressionInProgress = true;
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Img = reader.result as string;
                const compressedImgAsBase64Url =
                    await this.imageCompress.compressFile(
                        base64Img, DOC_ORIENTATION.Default,
                        100, 75, 1920, 1080);

                const response = await fetch(compressedImgAsBase64Url);
                const data = await response.blob();
                const compressedFile = new File(
                    [data],
                    `${file.name}`,
                    { type: file.type }
                );

                this.imageFiles.push({ file: compressedFile });
                this.imageSrcs.push(
                    this.sanitizer.sanitize(
                        SecurityContext.RESOURCE_URL,
                        this.sanitizer.bypassSecurityTrustResourceUrl(compressedImgAsBase64Url))!
                );

                if (i == files.length - 1) {
                    this.compressionInProgress = false;
                }
            }
        }

        this.imageFilesModified = true;
    }

    removeUploadedMedia(imgSrc: string) {
        this.imageSrcs.forEach((src, index) => {
            if (src === imgSrc) {
                this.imageSrcs.splice(index, 1);
                this.imageFiles.splice(index, 1);
            }
        });

        this.imageFilesModified = true;
    }

    async onCoverImageUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        const file = files.item(0)!;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Img = reader.result as string;

            const compressedImgAsBase64Url =
                await this.imageCompress.compressFile(
                    base64Img, DOC_ORIENTATION.Default,
                    100, 75, 1920, 1080);

            const response = await fetch(compressedImgAsBase64Url);
            const data = await response.blob();
            const compressedFile = new File(
                [data],
                `${file.name}`,
                { type: file.type }
            );

            this.coverImageFile = compressedFile;
            this.coverImageSrc =
                this.sanitizer.sanitize(
                    SecurityContext.RESOURCE_URL,
                    this.sanitizer.bypassSecurityTrustResourceUrl(compressedImgAsBase64Url))!;
        }

        this.coverImageModified = true;
    }

    removeCoverImage() {
        this.coverImageFile = undefined;
        this.coverImageSrc = undefined;
        this.coverImageModified = true;
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

        await this.listingUploadService.publishListing(this.listing, this.imageFiles, this.coverImageFile!);

        this.listing = {} as Listing;
        this.imageFiles = [];
        this.imageSrcs = [];
        this.coverImageFile = undefined;
        this.coverImageSrc = undefined;

        this.snackbar.open(
            this.snackbarMsgs['listing_upload.listing_published_msg'],
            this.snackbarMsgs['listing_upload.dismiss_msg'],
            {
                duration: 3000
            }
        );

        this.dialogRef.close();
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

        await this.listingUploadService.saveEdit(
            this.listing,
            this.dbReferenceId,
            this.imageFiles, this.imageFilesModified,
            this.coverImageFile!, this.coverImageModified
        );

        this.imageFilesModified = false;
        this.snackbar.open(
            this.snackbarMsgs['listing_upload.changes_saved_msg'],
            this.snackbarMsgs['listing_upload.dismiss_msg'],
            {
                duration: 3000
            }
        );
    }

    uploadedMediaDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.imageSrcs, event.previousIndex, event.currentIndex);
        moveItemInArray(this.imageFiles, event.previousIndex, event.currentIndex);
        this.imageFilesModified = true;
    }

    updateOptions() {
        // Filter for location as user types, return all if left blank
        this.filteredLocations$$.next(this.locations.filter(loc =>
            !this.listing.location || loc.toLowerCase().includes(this.listing.location.toLowerCase())
        ));
    }

    checkValidityForUpload(listing: Listing): boolean {
        const requiredFieldsAreFilled = listing.purpose?.length
            && listing.category?.length
            && listing.location?.length
            && !isNaN(Number(listing.bedrooms))
            && !isNaN(Number(listing.bathrooms))
            && !isNaN(Number(listing.price))
            && listing.currency?.length
            && listing.description?.length;

        if (requiredFieldsAreFilled && this.isEditMode) {
            return true;
        }

        if (requiredFieldsAreFilled && !this.isEditMode) {
            const imagesUploaded = this.imageFiles.length && this.coverImageFile;
            if (imagesUploaded) {
                return true;
            }
        }


        return false;
    }
}