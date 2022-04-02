import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollService } from 'ngx-page-scroll-core';
import { SearchCriteria } from './listing-search.data';

@Component({
    selector: 'listing-search',
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