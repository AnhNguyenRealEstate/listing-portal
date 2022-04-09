import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Listing } from '../listing-search/listing-search.data';

@Component({
    selector: 'listing-card',
    templateUrl: 'listing-card.component.html',
    styleUrls: ['./listing-card.component.scss']
})

export class ListingCardComponent implements OnInit {
    @Input() listing!: Listing;

    coverImageUrl: string = '';
    shareListingBtnTitle: string = '';

    linkCopiedMsg: string = '';

    constructor(
        private storage: Storage,
        private clipboard: Clipboard,
        private router: Router,
        private snackbar: MatSnackBar,
        public translate: TranslateService) { }

    async ngOnInit() {
        getDownloadURL(ref(this.storage, this.listing.coverImagePath)).then(url => {
            this.coverImageUrl = url;
        });

        this.linkCopiedMsg = await lastValueFrom(this.translate.get('listing_card.link_copied'));
    }

    getShareableLink(e: Event) {
        e.stopPropagation();

        if (!this.listing) {
            return;
        }

        this.clipboard.copy(`${window.location.host}/listings/details/${this.listing.id}`);
        this.snackbar.open(
            this.linkCopiedMsg,
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
}