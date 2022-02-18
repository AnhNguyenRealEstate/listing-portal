import { Component } from '@angular/core';

@Component({
    selector: 'app-about-us',
    templateUrl: 'about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})

export class AboutUsComponent {
    startYear = 2008;
    thisYear = (new Date()).getFullYear();
    tenure = this.thisYear - this.startYear;
    
    constructor() { }

}