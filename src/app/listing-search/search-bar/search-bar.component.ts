import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));

        this.subs.add(this.listingSearchService.resultCount().subscribe(num => {
            this.resultCount = num;
        }))

        const map = this.route.snapshot.paramMap;
        this.searchCriteria.purpose = map.get('purpose') as 'For Rent' | 'For Sale' || 'For Rent';
        this.searchCriteria.category = map.get('category') || '';
        this.searchCriteria.bathrooms = map.get('bathrooms') || '';
        this.searchCriteria.bedrooms = map.get('bedrooms') || '';

        this.getListings(this.searchCriteria);
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
}