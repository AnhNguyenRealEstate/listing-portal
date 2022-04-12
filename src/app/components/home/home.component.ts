import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listing, SearchCriteria } from 'src/app/listing-search/listing-search.data';
import { HomeService } from './home.service';
import { PropertySizes } from 'src/app/listing-search/listing-search.data';
import { DOCUMENT } from '@angular/common';
import { getAnalytics, logEvent } from '@angular/fire/analytics';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    numberOfMockListings = Array(3).fill(0);
    featuredListings!: Listing[];

    searchCriteria: SearchCriteria = {
        purpose: 'For Rent'
    } as SearchCriteria;

    propertySizes = PropertySizes;

    constructor(
        private router: Router,
        private homeService: HomeService,
        @Inject(DOCUMENT) { defaultView }: Document
    ) {
        const width = defaultView ? defaultView.innerWidth : 0;
        const mobileDevicesWidth = 600;
        const isDesktop = width > mobileDevicesWidth;
        if (isDesktop) {
            this.homeService.getFeaturedListings().then(listings => {
                this.featuredListings = listings;
            });
        }

        logEvent(getAnalytics(), 'home_page_view', {
            from_mobile: !isDesktop
        });
    }

    getListings() {
        this.router.navigate(['/listings', this.searchCriteria]);
    }

    findListingsForRent() {
        this.searchCriteria.purpose = 'For Rent';
    }

    findListingsForSale() {
        this.searchCriteria.purpose = 'For Sale';
    }

    onCategorySelect() {
        if (this.searchCriteria.category === 'Commercial') {
            this.searchCriteria.bedrooms = '';
            this.searchCriteria.bathrooms = '';
            this.searchCriteria.propertySize = '';
        } else {
            this.searchCriteria.propertySize = '';
        }
    }

    getListing(id: string | undefined) {
        if (!id) {
            return;
        }
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`listings/details/${id}`])
        );
        window.open(url, '_blank');
    }
}