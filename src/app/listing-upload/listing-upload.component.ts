import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, Renderer2, SecurityContext, ViewChild } from '@angular/core';
import { ListingImageFile } from '../listing-search/listing-search.data';
import { Listing, AMENITIES as ALL_AMENITIES } from "../listing-card/listing-card.data";
import { MetadataService } from 'src/app/shared/metadata.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ListingUploadService } from './listing-upload.service';
import { TranslateService } from '@ngx-translate/core';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseStorageConsts } from 'src/app/shared/globals';
import { AvailableContactChannels } from './listing-upload.data';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../projects/projects.data';

@Component({
    selector: 'listing-upload',
    templateUrl: 'listing-upload.component.html',
    styleUrls: ['./listing-upload.component.scss']
})
export class ListingUploadComponent implements OnInit, OnDestroy {
    @Input() listing: Listing = {} as Listing;
    @Input() isEditMode = false;

    @ViewChild('uploadForm') uploadForm!: NgForm;

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

    amenities: string[] = [];
    allAmenities: string[] = ALL_AMENITIES;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('amenitiesInput') amenitiesInput!: ElementRef<HTMLInputElement>;

    projects: Project[] = []

    projectNameForm: FormGroup;

    constructor(
        private snackbar: MatSnackBar,
        private metadata: MetadataService,
        private imageCompress: NgxImageCompressService,
        private sanitizer: DomSanitizer,
        public listingUploadService: ListingUploadService,
        private translate: TranslateService,
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        @Optional() private dialogRef: MatDialogRef<ListingUploadComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        if (this.data?.listing) {
            this.listing = this.data.listing as Listing;
            this.amenities = this.listing.amenities || [];
        }

        if (this.data?.isEditMode) {
            this.isEditMode = true;
        }

        this.projectNameForm = this.formBuilder.group({ projectName: [''] });
    }

    async ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
            this.updateOptions();
        }));

        this.snackbarMsgs = this.translate.instant(
            ['listing_upload.invalid_upload_msg',
                'listing_upload.listing_published_msg',
                'listing_upload.changes_saved_msg',
                'listing_upload.dismiss_msg']
        );

        this.projects = await this.listingUploadService.getAvailableProjects()
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    async onEditCoverImage() {
        this.uploadForm.form.markAsDirty();

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
        this.uploadForm.form.markAsDirty();

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
                    base64Img as string, DOC_ORIENTATION.Default,
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

    removeAmenity(amenity: string) {
        const index = this.amenities.indexOf(amenity);

        if (index >= 0) {
            this.amenities.splice(index, 1);
        }
    }

    addAmenity(event: MatChipInputEvent) {
        const value = (event.value || '').trim();

        if (value && this.amenities.indexOf(value) === -1) {
            this.amenities.push(value);
        }

        // Clear the input value
        event.chipInput!.clear();
    }

    selectedAmenity(event: MatAutocompleteSelectedEvent): void {
        const value = event.option.value;

        if (this.amenities.indexOf(value) >= 0) {
            return;
        }

        this.amenities.push(event.option.value);
        this.amenitiesInput.nativeElement.value = '';
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

        this.listing.amenities = this.amenities;

        await this.listingUploadService.publishListing(this.listing, this.imageFiles, this.coverImageFile!);

        this.listing = {} as Listing;
        this.imageFiles = [];
        this.imageSrcs = [];
        this.amenities = [];
        this.coverImageFile = undefined;
        this.coverImageSrc = undefined;

        this.snackbar.open(
            this.snackbarMsgs['listing_upload.listing_published_msg'],
            this.snackbarMsgs['listing_upload.dismiss_msg'],
            {
                duration: 3000
            }
        );

        if (this.dialogRef) {
            this.dialogRef.close();
        }
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

        this.listing.amenities = this.amenities;

        await this.listingUploadService.saveEdit(
            this.listing,
            this.listing.id!,
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
        this.filteredLocations$$.next(this.locations.filter(loc => {
            if (!this.listing.location) {
                return true;
            }

            const locDeburred = loc.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
            const userInputDeburred = this.listing.location.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

            return locDeburred.includes(userInputDeburred);
        }));
    }

    checkValidityForUpload(listing: Listing): boolean {
        const requiredFieldsAreFilled =
            !isNaN(Number(listing.bedrooms))
            && !isNaN(Number(listing.bathrooms))
            && !isNaN(Number(listing.price));

        if (!requiredFieldsAreFilled) {
            return false;
        }

        return true;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    showImgDeleteBtn(deleteBtn: HTMLElement) {
        this.renderer.removeStyle(deleteBtn, 'display');
    }

    removeImgDeleteBtn(deleteBtn: HTMLElement) {
        this.renderer.setStyle(deleteBtn, 'display', 'none');
    }
}