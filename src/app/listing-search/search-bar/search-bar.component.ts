import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { MetadataService } from 'src/app/shared/metadata.service';
import { SearchCriteria, PropertySizes } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';
import { CurrencyPipe } from '@angular/common';

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

    filterDescription: string = '';

    constructor(
        public listingSearchService: ListingSearchService,
        private metadata: MetadataService,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private currency: CurrencyPipe
    ) {
    }

    ngOnInit() {
        this.subs.add(this.metadata.locations().subscribe(data => {
            this.locations = data;
        }));

        this.subs.add(this.translate.onLangChange.subscribe(() => {
            this.constructFilterDescription();
        }));

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
        this.numberOfResults = results.length;

        if (this.mode === 'mobile') {
            this.panelOpenState = false;
        }
    }

    async constructFilterDescription() {
        const langTerms = await lastValueFrom(this.translate.get([
            'search_bar.apartment',
            'search_bar.villa',
            'search_bar.townhouse',
            'search_bar.commercial',
            'search_bar.bedrooms',
            'search_bar.bathrooms',
            'search_bar.us_dollar',
            'search_bar.vietnam_dong',
            'search_bar.from',
            'search_bar.up_to']));

        const newDescription: string[] = [];
        if (this.searchCriteria.category) {
            switch (this.searchCriteria.category) {
                case 'Apartment':
                    newDescription.push(langTerms['search_bar.apartment']);
                    break;
                case 'Villa':
                    newDescription.push(langTerms['search_bar.villa']);
                    break;
                case 'Townhouse':
                    newDescription.push(langTerms['search_bar.townhouse']);
                    break;
                case 'commercial':
                    newDescription.push(langTerms['search_bar.commercial']);
                    break;
                case 'default':
                    break;
            }
        }

        if (this.searchCriteria.location) {
            newDescription.push(this.searchCriteria.location);
        }

        if (this.searchCriteria.propertySize) {
            newDescription.push(`${this.propertySizes[this.searchCriteria.propertySize]} (m<sup>2</sup>)`);
        }

        if (this.searchCriteria.bedrooms) {
            newDescription.push(`${this.searchCriteria.bedrooms} ${(langTerms['search_bar.bedrooms'] as string).toLowerCase()}`);
        }

        if (this.searchCriteria.bathrooms) {
            newDescription.push(`${this.searchCriteria.bathrooms} ${(langTerms['search_bar.bathrooms'] as string).toLowerCase()}`);
        }

        let currency = this.searchCriteria.purpose === 'For Rent' ? 'USD' : 'VND';
        let currencyDescription: string = '';
        if (this.searchCriteria.minPrice) {
            currencyDescription = `${langTerms['search_bar.from']} ${this.currency.transform(this.searchCriteria.minPrice, currency, undefined, '1.0-0')}`;
        }
        if (this.searchCriteria.maxPrice) {
            currencyDescription += ` ${langTerms['search_bar.up_to']} ${this.currency.transform(this.searchCriteria.maxPrice, currency, undefined, '1.0-0')}`;
        }
        if (currencyDescription) {
            newDescription.push(currencyDescription);
        }

        this.filterDescription = newDescription.join(', ');
    }
}