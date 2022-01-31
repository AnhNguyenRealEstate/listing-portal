import { Component, OnInit } from '@angular/core';
import { LoadSpinnerService } from './loading-spinner.service';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: 'loading-spinner.component.html'
})

export class LoadingSpinnerComponent implements OnInit {
    constructor(public loadingSpinnerService: LoadSpinnerService) { }

    ngOnInit() { }
}