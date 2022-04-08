import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { TranslateService } from '@ngx-translate/core';
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

    constructor(
        private storage: Storage,
        private clipboard: Clipboard,
        public translate: TranslateService) { }

    async ngOnInit() {
        getDownloadURL(ref(this.storage, this.listing.coverImagePath)).then(url => {
            this.coverImageUrl = url;
        });
    }

    getShareableLink(e: Event) {
        e.stopPropagation();

        if (!this.listing) {
            return;
        }
        this.clipboard.copy(`${window.location.host}/listings/details/${this.listing.id}`);
    }
}