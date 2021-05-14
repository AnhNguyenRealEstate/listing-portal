import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: 'carousel.component.html'
})

export class CarouselComponent implements OnInit {
    imageSources: string[] = [];
    descriptions: string[] = [];

    constructor() { }

    ngOnInit() { 
        this.imageSources = [1, 2, 3].map(n => `/assets/images/carousel_${n}.jpeg`);
        this.descriptions = [
            'Anh Nguyen Real Estate',
            '10+ years serving our community',
            'Find your home today'
        ]
    }
}