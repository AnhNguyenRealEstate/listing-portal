import { Component } from '@angular/core';

@Component({
    selector: 'app-about-us',
    templateUrl: 'about-us.component.html'
})

export class AboutUsComponent {
    startYear = 2008;
    thisYear = (new Date()).getFullYear();
    
    constructor() { }

}