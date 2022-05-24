import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
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
        purpose: 'For Rent',
        orderBy: 'Most Recent'
    } as SearchCriteria;

    locations: string[] = [];

    propertySizes = PropertySizes;

    subs: Subscription = new Subscription();

    filterDescription: string = '';

    resultCount!: number;

    constructor(
        public listingSearchService: ListingSearchService,
        private metadata: MetadataService,
        private route: ActivatedRoute
    ) {
    }

    async ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));

        this.subs.add(this.listingSearchService.resultCount().subscribe(num => {
            this.resultCount = num;
        }));

        if (this.mode === 'desktop') {
            this.panelOpenState = true;
        }

        this.subs.add(this.route.queryParamMap.subscribe(map => {
            this.searchCriteria.purpose = map.get('purpose') as 'For Rent' | 'For Sale' || 'For Rent';
            this.searchCriteria.category = map.get('category') || '';
            this.searchCriteria.propertySize = map.get('propertySize') || '';

            this.getListings(this.searchCriteria);
        }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    async getListings(criteria: SearchCriteria) {
        this.listingSearchService.setSearchResults([]);
        const results = await this.listingSearchService.getListingsByCriteria(criteria);
        this.listingSearchService.setSearchResults(results);

        if (this.mode === 'mobile') {
            this.panelOpenState = false;
        }
    }

    clearFilter() {
        this.searchCriteria = {
            ...this.searchCriteria,
            ...{
                category: '',
                propertySize: '',
                location: '',
                minPrice: 0,
                maxPrice: undefined,
                bedrooms: '',
                bathrooms: ''
            }
        }
    }
}