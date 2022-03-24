import { Component, Input, OnChanges, OnDestroy, OnInit, SecurityContext, SimpleChanges } from '@angular/core';
import { Listing, ListingImageFile } from '../../listing-search/listing-search.data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetadataService } from 'src/app/shared/metadata.service';
import { Subscription } from 'rxjs';
import { ListingUploadService } from './listing-upload.service';
import { TranslateService } from '@ngx-translate/core';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { DomSanitizer } from '@angular/platform-browser';
import mergeImages from 'merge-images';

@Component({
    selector: 'listing-upload',
    templateUrl: 'listing-upload.component.html',
    styleUrls: ['./listing-upload.component.scss']
})
export class ListingUploadComponent implements OnInit, OnDestroy, OnChanges {
    @Input() listing: Listing = {} as Listing;
    @Input() isEditMode = false;
    @Input() dbReferenceId: string = '';

    modalTitle: string = '';

    locations: string[] = [];

    imageFiles: ListingImageFile[] = [];
    imageSrcs: string[] = [];
    imageFilesModified: boolean = false;
    compressionInProgress: boolean = false;

    coverImageFile: File | undefined = undefined;
    coverImageSrc: string | undefined = undefined;
    coverImageModified: boolean = false;

    watermarkImg: string = '';

    subs: Subscription = new Subscription();
    showSpinner: boolean = false;

    snackbarMsgs!: any;

    constructor(
        private snackbar: MatSnackBar,
        private metadata: MetadataService,
        private imageCompress: NgxImageCompressService,
        private sanitizer: DomSanitizer,
        public listingUploadService: ListingUploadService,
        private translate: TranslateService
    ) {
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
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.listing && changes.listing.currentValue) {
            this.showSpinner = true;

            this.imageFiles = [];
            this.imageSrcs = [];
            await this.listingUploadService.getListingImages(
                this.listing.fireStoragePath!, this.imageSrcs, this.imageFiles
            );

            this.coverImageFile = await this.listingUploadService.getListingCoverImage(this.listing.coverImagePath!);

            const reader = new FileReader();
            reader.readAsDataURL(this.coverImageFile);
            reader.onloadend = () => {
                this.coverImageSrc = reader.result as string;
            }

            this.showSpinner = false;
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

    async onMediaUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        this.compressionInProgress = true;

        if (!this.watermarkImg) {
            const response = await fetch('/assets/images/logo.png');
            const data = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const metadata = {
                type: contentType
            };
            const fileExtension = contentType.split('/').pop() || '';
            const file = new File([data], `watermark.${fileExtension}`, metadata);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                this.watermarkImg = reader.result as string;
            };
        }

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Img = reader.result as string;
                const watermarkedImg = await mergeImages([base64Img, this.watermarkImg]);
                const compressedImgAsBase64Url =
                    await this.imageCompress.compressFile(
                        watermarkedImg, DOC_ORIENTATION.Default,
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

                if(i == files.length - 1) {
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

        if (!this.watermarkImg) {
            const response = await fetch('/assets/images/logo.png');
            const data = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const metadata = {
                type: contentType
            };
            const fileExtension = contentType.split('/').pop() || '';
            const file = new File([data], `watermark.${fileExtension}`, metadata);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                this.watermarkImg = reader.result as string;
            };
        }

        const file = files.item(0)!;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Img = reader.result as string;
            const watermarkedImg = await mergeImages([base64Img, this.watermarkImg]);
            const compressedImgAsBase64Url =
                await this.imageCompress.compressFile(
                    watermarkedImg as string, DOC_ORIENTATION.Default,
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

    checkValidityForUpload(listing: Listing): boolean {
        if (listing.purpose?.length
            && listing.category?.length
            && listing.location?.length
            && !isNaN(Number(listing.bedrooms))
            && !isNaN(Number(listing.bathrooms))
            && !isNaN(Number(listing.price))
            && listing.currency?.length
            && listing.description?.length
            && this.imageFiles.length
            && this.coverImageFile) {
            return true;
        }
        return false;
    }
}