import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login-dialog.component';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html'
})

export class LayoutComponent {
    loggedIn: boolean = false;
    isMenuOpen: boolean = false;

    constructor(
        private router: Router,
        private auth: AngularFireAuth, 
        private dialog: MatDialog) {
        this.auth.user.subscribe(user => {
            this.loggedIn = !!(user && user.email);
        });
    }

    showLoginModal() {
        const config = {
            height: 'auto',
            width: 'auto'
        } as MatDialogConfig;
        this.dialog.open(LoginComponent, config);
    }

    logout() {
        this.auth.signOut().then(response => {
            this.router.navigateByUrl('');
        });
    }
}