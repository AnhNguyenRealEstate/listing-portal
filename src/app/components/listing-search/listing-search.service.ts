import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListingSearchService {
    constructor(private httpClient: HttpClient) { }

    getListings(): Observable<any> {
        return this.httpClient.get('');
    }

    
}