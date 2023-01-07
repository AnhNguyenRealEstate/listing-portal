import { Component, createNgModule, Injector, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/projects/projects.data';
import { LoginComponent } from '../login/login-dialog.component';
import { LoginService } from '../login/login.service';
import { LayoutService } from './layout.service';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
    loggedIn: boolean = false;
    lang!: string;
    sub = new Subscription();

    projects: Project[] = []

    constructor(
        private router: Router,
        public auth: Auth,
        private loginService: LoginService,
        private dialog: MatDialog,
        private injector: Injector,
        private layout: LayoutService,
        public translate: TranslateService) {
        this.sub.add(this.loginService.loggedIn$.subscribe(loggedIn => this.loggedIn = loggedIn));
    }

    async ngOnInit() {
        const sessionLang = localStorage.getItem('lang');
        this.lang = sessionLang || this.translate.getDefaultLang();

        this.projects = await this.layout.getProjects()
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
            autoFocus: false,
            disableClose: true
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModule(ListingUploadModule, this.injector);
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
            },
            disableClose: true
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModule(ListingUploadModule, this.injector);
        const listingUploadDialogComponent = moduleRef.instance.getListingUploadDialogComponent();

        this.dialog.open(listingUploadDialogComponent, config);
    }

    async uploadNewProject() {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            disableClose: true
        } as MatDialogConfig;

        const { ProjectUploadModule } = await import("src/app/projects/project-upload/project-upload.module");
        const moduleRef = createNgModule(ProjectUploadModule, this.injector);
        const projectUploadComp = moduleRef.instance.getProjectUploadComponent();

        this.dialog.open(projectUploadComp, config);
    }

    useLanguage(lang: string) {
        this.translate.use(lang);
        this.lang = lang;
        localStorage.setItem('lang', this.lang);
    }

    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('');
        });
    }
}