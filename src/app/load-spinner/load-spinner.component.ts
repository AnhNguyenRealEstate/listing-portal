import { Component, OnInit } from '@angular/core';
import { LoadSpinnerService } from './load-spinner.service';

@Component({
    selector: 'app-spinner',
    templateUrl: 'load-spinner.component.html',
    styleUrls: ['./load-spinner.component.scss']
})

export class LoadingSpinnerComponent implements OnInit {
    constructor(public loadingSpinnerService: LoadSpinnerService) { }

    ngOnInit() { }
}