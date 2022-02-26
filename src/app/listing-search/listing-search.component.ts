import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
    selector: 'app-listing-search',
    templateUrl: 'listing-search.component.html',
    styleUrls: ['./listing-search.component.scss']
})

export class ListingSearchComponent {
    constructor(
        private pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any) {
    }

    scrollTop() {
        this.pageScrollService.scroll({
            document: this.document,
            scrollTarget: '.navbar',
            duration: 250
        });
    }
}