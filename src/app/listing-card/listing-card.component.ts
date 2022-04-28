import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../components/login/login.service';
import { Listing } from '../listing-search/listing-search.data';
import { ListingUploadDialogComponent } from '../listing-upload/listing-upload-dialog.component';
import { ListingUploadComponent } from '../listing-upload/listing-upload.component';

@Component({
    selector: 'listing-card',
    templateUrl: 'listing-card.component.html',
    styleUrls: ['./listing-card.component.scss']
})

export class ListingCardComponent implements OnInit {
    @Input() listing!: Listing;

    coverImageUrl: string = '';
    shareListingBtnTitle: string = '';

    constructor(
        private storage: Storage,
        private clipboard: Clipboard,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        public login: LoginService,
        public translate: TranslateService) { }

    ngOnInit() {
        getDownloadURL(ref(this.storage, this.listing.coverImagePath)).then(url => {
            this.coverImageUrl = url;
        });
    }

    async getShareableLink(e: Event) {
        e.stopPropagation();

        if (!this.listing) {
            return;
        }

        this.clipboard.copy(`${window.location.host}/listings/details/${this.listing.id}`);
        this.snackbar.open(
            await lastValueFrom(this.translate.get('listing_card.link_copied')),
            undefined,
            {
                duration: 1000
            })
    }

    showListing() {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`listings/details/${this.listing.id}`])
        );
        window.open(url, '_blank');
    }

    editListing(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: this.listing,
                isEditMode: true
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadComponent, config)
    }

    editListingMobile(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            data: {
                listing: this.listing,
                isEditMode: true
            }
        } as MatDialogConfig;
        this.dialog.open(ListingUploadDialogComponent, config)
    }
}