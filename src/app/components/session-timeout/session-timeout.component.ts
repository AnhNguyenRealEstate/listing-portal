import { Component } from '@angular/core';

@Component({
    selector: 'app-timeout',
    template: `<h1>Inactivity Warning</h1>
                <p>You have been inactive and will be signed out in 5 minutes.</p>`
})

export class TimeoutComponent {
    constructor() { }
}