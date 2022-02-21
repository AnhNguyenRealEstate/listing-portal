import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginComponent } from '../login/login-dialog.component';
import { LoginService } from '../login/login.service';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
    loggedIn: boolean = false;
    isMenuOpen: boolean = false;

    constructor(
        private router: Router,
        private auth: Auth,
        private loginService: LoginService,
        private dialog: MatDialog,
        public translate: TranslateService) {
        this.loginService.loggedIn$.subscribe(loggedIn => this.loggedIn = loggedIn);
    }

    ngOnInit(): void {
        const sessionLang = localStorage.getItem('lang');
        this.translate.use(sessionLang || 'en');
    }

    showLoginModal() {
        const config = {
            height: 'auto',
            width: 'auto'
        } as MatDialogConfig;
        this.dialog.open(LoginComponent, config);
    }

    useLanguage(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }

    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('');
        });
    }
}