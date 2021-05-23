import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html'
})

export class LayoutComponent {
    isMenuOpen: boolean = false;

    constructor() {
    }
}