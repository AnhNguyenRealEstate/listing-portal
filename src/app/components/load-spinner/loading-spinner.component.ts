import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerService } from './loading-spinner.service';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: 'loading-spinner.component.html'
})

export class LoadingSpinnerComponent implements OnInit {
    constructor(public loadingSpinnerService: LoadingSpinnerService) { }

    ngOnInit() { }
}