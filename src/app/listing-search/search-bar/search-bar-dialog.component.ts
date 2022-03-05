import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MetadataService } from 'src/app/shared/metadata.service';
import { PropertySizes, SearchCriteria } from '../listing-search.data';

@Component({
    selector: 'search-bar-dialog',
    templateUrl: 'search-bar-dialog.component.html',
    styleUrls: ['./search-bar-dialog.component.scss']
})

export class SearchBarDialogComponent implements OnInit, OnDestroy {
    searchCriteria: SearchCriteria = {} as SearchCriteria;

    locations: string[] = [];

    propertySizes = PropertySizes;

    subs: Subscription = new Subscription();

    constructor(
        private metadata: MetadataService,
        public dialogRef: MatDialogRef<SearchBarDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: SearchCriteria
    ) {
        this.searchCriteria = { ...this.data };
    }

    ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    getListings() {
        this.dialogRef.close({ isSearchBtnClick: true, criteria: this.searchCriteria });
    }
}