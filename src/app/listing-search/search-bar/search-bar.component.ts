import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MetadataService } from 'src/app/shared/metadata.service';
import { SearchCriteria, PropertySizes } from '../listing-search.data';
import { ListingSearchService } from '../listing-search.service';

@Component({
    selector: 'search-bar',
    templateUrl: 'search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
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
        purpose: 'For Sale',
        orderBy: 'Most Recent'
    } as SearchCriteria;

    locations: string[] = [];

    propertySizes = PropertySizes;

    subs: Subscription = new Subscription();

    filterDescription: string = '';

    resultCount!: number;

    PRICE_SLIDER_MAX_BUY_PRICE: number = 100000000000;
    PRICE_SLIDER_MAX_RENT_PRICE: number = 9999;
    PRICE_SLIDER_RENT_STEP_SIZE: number = 100;
    PRICE_SLIDER_BUY_STEP_SIZE: number = 1000000000;
    priceSliderMax: number = 9999;
    priceSliderStepSize: number = 100;

    constructor(
        public listingSearchService: ListingSearchService,
        private metadata: MetadataService,
        private route: ActivatedRoute,
        private translate: TranslateService
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
            this.searchCriteria.purpose = map.get('purpose') as 'For Rent' | 'For Sale' || 'For Sale';
            this.searchCriteria.category = map.get('category') || '';
            this.searchCriteria.propertySize = map.get('propertySize') || '';

            this.updatePriceSlider();

            this.getListings(this.searchCriteria);

            this.updateFilterDescription();
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
        this.updatePriceSlider()
    }

    updateFilterDescription() {
        let category;
        if (this.searchCriteria.category) {
            category = this.translate.instant(`property_category.${this.searchCriteria.category?.toLowerCase()}`);
        }

        let propertySize;
        if (this.searchCriteria.propertySize) {
            propertySize = `${this.propertySizes[this.searchCriteria.propertySize]} m<sup>2</sup>`;
        }

        let bedrooms;
        if (this.searchCriteria.bedrooms) {
            bedrooms = `${this.searchCriteria.bedrooms} ${this.translate.instant('search_bar.bedrooms')?.toLowerCase()}`;
        }

        let bathrooms;
        if (this.searchCriteria.bathrooms) {
            bathrooms = `${this.searchCriteria.bathrooms} ${this.translate.instant('search_bar.bathrooms')?.toLowerCase()}`;
        }

        let minPrice;
        if (this.searchCriteria.minPrice) {
            let value = String(this.searchCriteria.minPrice);
            if (this.searchCriteria.purpose === 'For Rent') {
                value = `$${value}`;
            } else if (this.searchCriteria.purpose === 'For Sale') {
                value = `đ${value}`;
            }
            minPrice = `${this.translate.instant('search_bar.price_from')?.toLowerCase()} ${value}`;
        }

        let maxPrice;
        if (this.searchCriteria.maxPrice) {
            let value = this.searchCriteria.maxPrice.toLocaleString();
            if (this.searchCriteria.purpose === 'For Rent') {
                value = `$${value}`;
            } else if (this.searchCriteria.purpose === 'For Sale') {
                value = `đ${value}`;
            }
            maxPrice = `${this.translate.instant('search_bar.price_to')?.toLowerCase()} ${value}`;
        }
        const priceDescription = `${minPrice || ''} ${maxPrice || ''}`.trim();

        this.filterDescription =
            [
                category,
                this.searchCriteria.location,
                propertySize,
                bedrooms,
                bathrooms,
                priceDescription
            ].filter(criterion => criterion?.length).join(', ')
    }

    updatePriceSlider() {
        this.priceSliderMax =
            this.searchCriteria.purpose === 'For Rent' ?
                this.PRICE_SLIDER_MAX_RENT_PRICE :
                this.PRICE_SLIDER_MAX_BUY_PRICE

        this.priceSliderStepSize = this.searchCriteria.purpose === 'For Rent' ?
            this.PRICE_SLIDER_RENT_STEP_SIZE :
            this.PRICE_SLIDER_BUY_STEP_SIZE

        this.searchCriteria.maxPrice = this.priceSliderMax
    }
}