import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { pipe } from 'rxjs';
import { SearchCriteria, PropertyTypes, Locations, PropertySizes } from '../listing-search.data';

@Component({
    selector: 'app-search-bar',
    templateUrl: 'search-bar.component.html'
})

export class SearchBarComponent implements OnInit {
    @Input() searchCriteria: SearchCriteria = {
        propertyType: '',
        propertySize: '',
        location: '',
        minPrice: 0,
        maxPrice: Infinity,
        bedrooms: '',
        bathrooms: ''
    } as SearchCriteria;

    @Output() searchCompleted = new EventEmitter();

    propertyTypes = PropertyTypes;
    locations = Locations;
    propertySizes = PropertySizes;

    constructor(private firestore: AngularFirestore) {
    }

    ngOnInit() {

    }

    async getListings() {
        //TODO: submit criteria to server, once the response comes back,
        //save the data to listing-search service

        // const response = await this.firestore.collection('listings', query => 
        //                         query.where('', '==', '')
        //                         .where('', '==', '')
        //                         .where('', '==', '')
        //                         .where('', '==', '')).get();
        
        this.searchCompleted.emit();
    }
    
}