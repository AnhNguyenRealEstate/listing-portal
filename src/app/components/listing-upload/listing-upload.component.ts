import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Listing } from '../listing-search/listing-search.data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppDataService } from 'src/app/shared/app-data.service';
import { Subscription } from 'rxjs';
import { ListingUploadService } from './listing-upload.service';
import { LoadingSpinnerService } from '../load-spinner/loading-spinner.service';

@Component({
    selector: 'app-listing-upload',
    templateUrl: 'listing-upload.component.html',
    styleUrls: ['./listing-upload.component.scss']
})
export class ListingUploadComponent implements OnInit, OnDestroy {
    @Input() listing: Listing = {} as Listing;
    @Input() isEditMode = false;
    @Input() snackbarMessage: string = '';
    @Input() dbReferenceId: string = '';

    modalTitle: string = '';

    propertyTypes: string[] = [];
    locations: string[] = [];

    imageFiles: File[] = [];
    imageSrcs: string[] = [];

    subs: Subscription = new Subscription();
    showSpinner: boolean = false;

    constructor(
        private snackbar: MatSnackBar,
        private appDataService: AppDataService,
        private listingUploadService: ListingUploadService,
        private loadingSpinnerService: LoadingSpinnerService
    ) {
    }

    async ngOnInit() {
        this.subs.add(this.appDataService.propertyTypes().subscribe(data => {
            this.propertyTypes = data;
        }));

        this.subs.add(this.appDataService.locations().subscribe(data => {
            this.locations = data;
        }));

        await this.listingUploadService.getListingImages(this.listing.imageFolderPath!, this.imageSrcs, this.imageFiles);
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    onPurposeSelect(event: any) {
        this.listing.purpose = event.value;
    }

    handleImageInput(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            this.imageFiles.push(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    this.imageSrcs.push(reader.result as string)
                }
            }
        }
    }

    removeImage(imgSrc: string) {
        this.imageSrcs.forEach((src, index) => {
            if (src === imgSrc) {
                this.imageSrcs.splice(index, 1);
                this.imageFiles.splice(index, 1);
            }
        });
    }

    /* Uploads a new listing and create a new image storage path for related images */
    async publishListing() {
        this.loadingSpinnerService.startLoadingSpinner();

        await this.listingUploadService.publishListing(this.listing, this.imageFiles);

        this.listing = {} as Listing;
        this.imageFiles = [];
        this.imageSrcs = [];

        this.loadingSpinnerService.stopLoadingSpinner();

        this.snackbar.open("Listing published 🎉", "Dismiss", {
            duration: 3000
        });
    }

    /* Save any editting on the listing and its image storage */
    async saveEdit() {
        this.loadingSpinnerService.startLoadingSpinner();
        await this.listingUploadService.saveEdit(this.listing, this.imageFiles, this.dbReferenceId);
        this.loadingSpinnerService.stopLoadingSpinner();

        this.snackbar.open("Changes saved ✅", "Dismiss", {
            duration: 3000
        })
    }
}