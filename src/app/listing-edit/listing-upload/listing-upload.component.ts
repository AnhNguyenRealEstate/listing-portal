import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Listing, ListingImageFile } from '../../listing-search/listing-search.data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetadataService } from 'src/app/shared/metadata.service';
import { Subscription } from 'rxjs';
import { ListingUploadService } from './listing-upload.service';
import { LoadSpinnerService } from 'src/app/load-spinner/load-spinner.service';

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

    subs: Subscription = new Subscription();
    showSpinner: boolean = false;

    constructor(
        private snackbar: MatSnackBar,
        private metadata: MetadataService,
        private listingUploadService: ListingUploadService,
        private loadSpinner: LoadSpinnerService,
    ) {
    }

    async ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.listing && changes.listing.currentValue) {
            this.showSpinner = true;
            await this.listingUploadService.getListingImages(this.listing.imageFolderPath!, this.imageSrcs, this.imageFiles);
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

    /* Uploads a new listing and create a new image storage path for related images */
    async publishListing() {
        if (!this.checkValidityForUpload(this.listing)) {
            this.snackbar.open("Please fill in all fields and upload images", "Dismiss", {
                duration: 3000
            });
            return;
        }

        this.loadSpinner.start();

        await this.listingUploadService.publishListing(this.listing, this.imageFiles);

        this.listing = {} as Listing;
        this.imageFiles = [];
        this.imageSrcs = [];

        this.loadSpinner.stop();

        this.snackbar.open("Listing published 🎉", "Dismiss", {
            duration: 3000
        });
    }

    /* Save any editting on the listing and its image storage */
    async saveEdit() {
        if (!this.checkValidityForUpload(this.listing)) {
            this.snackbar.open("Please fill in all fields and upload images", "Dismiss", {
                duration: 3000
            });
            return;
        }
        
        this.loadSpinner.start();
        await this.listingUploadService.saveEdit(this.listing, this.dbReferenceId, this.imageFiles, this.imageFilesModified);
        this.loadSpinner.stop();

        this.imageFilesModified = false;
        this.snackbar.open("Changes saved ✅", "Dismiss", {
            duration: 3000
        })
    }

    checkValidityForUpload(listing: Listing): boolean {
        if (listing.purpose?.length
            && listing.propertyType?.length
            && listing.location?.length
            && typeof listing.bedrooms === "number"
            && typeof listing.bathrooms === "number"
            && typeof listing.price === "number"
            && listing.currency?.length
            && listing.description?.length
            && listing.images?.length) {
            return true;
        }
        return false;
    }
}