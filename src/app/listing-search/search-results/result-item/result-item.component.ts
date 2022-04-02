import { Component, Input, OnInit } from '@angular/core';
import { Listing } from '../../listing-search.data';

@Component({
    selector: 'result-item',
    templateUrl: 'result-item.component.html',
    styleUrls: ['./result-item.component.scss']
})

export class ResultItemComponent implements OnInit {
    @Input() mode!: 'mobile' | 'desktop';
    @Input() result!: Listing;

    constructor() { }

    ngOnInit() { }
}