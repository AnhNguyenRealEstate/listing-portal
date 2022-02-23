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
    lang: string = 'en';

    constructor(
        private router: Router,
        private auth: Auth,
        private loginService: LoginService,
        private dialog: MatDialog,
        public translate: TranslateService) {
        this.loginService.loggedIn$.subscribe(loggedIn => this.loggedIn = loggedIn);
    }

    ngOnInit(): void {
        this.translate.setDefaultLang('en');

        const sessionLang = localStorage.getItem('lang');
        this.lang = sessionLang || 'en';
        this.translate.use(this.lang);
    }

    showLoginModal() {
        const config = {
            height: 'auto',
            width: '90%'
        } as MatDialogConfig;
        this.dialog.open(LoginComponent, config);
    }

    useLanguage(event: any) {
        this.lang = event.value;
        this.translate.use(this.lang);
        localStorage.setItem('lang', this.lang);
    }

    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('');
        });
    }
}