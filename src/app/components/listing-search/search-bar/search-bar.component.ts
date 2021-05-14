import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchCriteria, PropertyTypes, Locations, PropertySizes } from '../listing-search.data';

@Component({
    selector: 'app-search-bar',
    templateUrl: 'search-bar.component.html'
})

export class SearchBarComponent implements OnInit {
    searchCriteria: SearchCriteria;
    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    constructor(private router: Router) {
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
        //TODO: submit criteria to server, once the response comes back,
        //save to listing-search service as observable?

        this.router.navigateByUrl('/listings');

    }  
}