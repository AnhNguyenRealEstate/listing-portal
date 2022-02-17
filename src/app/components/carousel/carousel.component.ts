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
    }
}