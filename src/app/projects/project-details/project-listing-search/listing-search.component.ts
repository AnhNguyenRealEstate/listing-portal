import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
    selector: 'project-listing-search',
    templateUrl: 'listing-search.component.html',
    styleUrls: ['./listing-search.component.scss']
})

export class ListingSearchComponent implements OnInit {
    @Input() projectId: string = ''

    constructor(
        private pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit(): void {
        logEvent(getAnalytics(), 'project_search_page_view');
    }

    scrollTop() {
        this.pageScrollService.scroll({
            document: this.document,
            scrollTarget: '.navbar',
            duration: 250
        });
    }
}