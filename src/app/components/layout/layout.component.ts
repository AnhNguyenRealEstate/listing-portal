import { Component, createNgModuleRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/shared/roles.service';
import { LoginComponent } from '../login/login-dialog.component';
import { LoginService } from '../login/login.service';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
    loggedIn: boolean = false;
    defaultLang = 'vn';
    lang: string = this.defaultLang;
    sub = new Subscription();

    constructor(
        private router: Router,
        public auth: Auth,
        private loginService: LoginService,
        public roles: RolesService,
        private dialog: MatDialog,
        private injector: Injector,
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

    async uploadNewListing() {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModuleRef(ListingUploadModule, this.injector);
        const listingUploadComponent = moduleRef.instance.getListingUploadComponent();

        this.dialog.open(listingUploadComponent, config);
    }

    async uploadNewListingMobile() {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                listing: {}
            }
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModuleRef(ListingUploadModule, this.injector);
        const listingUploadDialogComponent = moduleRef.instance.getListingUploadDialogComponent();

        this.dialog.open(listingUploadDialogComponent, config);
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