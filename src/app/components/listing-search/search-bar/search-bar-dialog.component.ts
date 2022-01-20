import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppDataService } from 'src/app/shared/app-data.service';
import { PropertySizes, SearchCriteria } from '../listing-search.data';

@Component({
    selector: 'app-search-bar-dialog',
    templateUrl: 'search-bar-dialog.component.html'
})

export class SearchBarDialogComponent implements OnInit, OnDestroy {
    searchCriteria: SearchCriteria = {} as SearchCriteria;

    propertyTypes: string[] = [];
    locations: string[] = [];

    propertySizes = PropertySizes;

    subs: Subscription = new Subscription();

    constructor(
        private appDataService: AppDataService,
        public dialogRef: MatDialogRef<SearchBarDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: SearchCriteria
    ) {
        this.searchCriteria = { ...this.data };
    }

    ngOnInit() {
        this.subs.add(this.appDataService.propertyTypes().subscribe(data => {
            this.propertyTypes = data;
        }));

        this.subs.add(this.appDataService.locations().subscribe(data => {
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