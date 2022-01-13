import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login-dialog.component';
import { RouteGuardService } from '../../shared/route-guard.service';

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
        private loginService: RouteGuardService,
        private dialog: MatDialog) {
        this.loginService.loggedIn$.subscribe(loggedIn => this.loggedIn = loggedIn);
    }

    showLoginModal() {
        const config = {
            height: 'auto',
            width: 'auto'
        } as MatDialogConfig;
        this.dialog.open(LoginComponent, config);
    }

    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('');
        });
    }
}