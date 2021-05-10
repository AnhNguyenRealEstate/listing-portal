import { Component, OnInit } from '@angular/core';
import { SearchCriteria, PropertyTypes, Locations, PropertySizes } from '../listing-search.data';

@Component({
    selector: 'app-search-bar',
    templateUrl: 'search-bar.component.html',
    styleUrls: ['search-bar.sass']
})

export class SearchBarComponent implements OnInit {
    searchCriteria: SearchCriteria;
    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    constructor() {
        this.searchCriteria = {
            propertyType: '',
            propertySize: '',
            location: '',
            minPrice: 0,
            maxPrice: Infinity,
            bedrooms: '',
            bathrooms: ''
        } as SearchCriteria;
    }

    ngOnInit() {

    }

    getListings() {
        const test = this.searchCriteria;
    }
}