import { Component, Input, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Listing } from '../listing-search/listing-search.data';

@Component({
    selector: 'listing-card',
    templateUrl: 'listing-card.component.html',
    styleUrls: ['./listing-card.component.scss']
})

export class ListingCardComponent implements OnInit {
    @Input() mode!: 'mobile' | 'desktop';
    @Input() listing!: Listing;

    coverImageUrl: string = '';

    constructor(private storage: Storage) { }

    async ngOnInit() {
        this.coverImageUrl = await getDownloadURL(ref(this.storage, this.listing.coverImagePath));
    }
}