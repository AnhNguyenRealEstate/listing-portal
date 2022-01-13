import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-timeout',
    template: `<h1>Inactivity warning</h1>
                <p>You have been inactive and will be signed out in 5 minutes.</p>`
})

export class TimeoutComponent {
    constructor() { }
}