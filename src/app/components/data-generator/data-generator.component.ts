import { Component } from '@angular/core';
import { DataGeneratorService } from './data-generator.service';

@Component({
    selector: 'app-data-generator',
    templateUrl: 'data-generator.component.html'
})

export class DataGeneratorComponent {
    listingsToGenerate: number = 15;

    constructor(
        private generator: DataGeneratorService,
    ) { }

    generateData() {
        this.generator.generateListings(this.listingsToGenerate);
    }

    deleteAll() {
        this.generator.deleteAll();
    }
}