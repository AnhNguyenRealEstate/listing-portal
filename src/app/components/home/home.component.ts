import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listing, SearchCriteria } from 'src/app/listing-search/listing-search.data';
import { HomeService } from './home.service';
import { PropertySizes } from 'src/app/listing-search/listing-search.data';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    numberOfMockListings = Array(3).fill(0);
    featuredListings!: Listing[];

    searchCriteria: SearchCriteria = {
    } as SearchCriteria;

    propertySizes = PropertySizes;

    constructor(
        private router: Router,
        private homeService: HomeService
    ) { }

    ngOnInit(): void {
        this.homeService.getFeaturedListings().then(listings => {
            this.featuredListings = listings;
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