import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../login/login-dialog.component';
import { LoginService } from '../login/login.service';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
    loggedIn: boolean = false;
    isMenuOpen: boolean = false;
    defaultLang = 'vn';
    lang: string = this.defaultLang;
    sub = new Subscription();

    constructor(
        private router: Router,
        public auth: Auth,
        private loginService: LoginService,
        private dialog: MatDialog,
        public translate: TranslateService) {
        this.sub.add(this.loginService.loggedIn$.subscribe(loggedIn => this.loggedIn = loggedIn));
    }

    ngOnInit(): void {
        const sessionLang = localStorage.getItem('lang');
        this.lang = sessionLang || this.defaultLang;
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
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