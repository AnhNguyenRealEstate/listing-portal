import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MetadataService } from 'src/app/shared/metadata.service';
import { SearchCriteria, PropertySizes } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'search-bar',
    templateUrl: 'search-bar.component.html'
})

export class SearchBarComponent implements OnInit, OnDestroy {
    @Input() mode: 'desktop' | 'mobile' = 'desktop';
    panelOpenState: boolean = false;

    searchCriteria: SearchCriteria = {
        category: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: undefined,
        bedrooms: '',
        bathrooms: '',
        purpose: 'For Rent'
    } as SearchCriteria;

    locations: string[] = [];

    propertySizes = PropertySizes;

    subs: Subscription = new Subscription();

    numberOfResults: number = 0;

    constructor(
        public listingSearchService: ListingSearchService,
        private metadata: MetadataService
    ) {
    }

    ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));

        this.getListings();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    async getListings(criteria: SearchCriteria = this.searchCriteria) {
        this.listingSearchService.setSearchResults([]);
        const results = await this.listingSearchService.getListingsByCriteria(criteria);
        this.listingSearchService.setSearchResults(results);
        this.numberOfResults = results.length;

        if (this.mode === 'mobile') {
            this.panelOpenState = false;
        }
    }
}