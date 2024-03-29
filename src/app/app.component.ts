import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessionTimeoutService } from './components/session-timeout/session-timeout.service';

@Component({
    selector: 'app-root',
    template: `<app-layout></app-layout>`,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    appTitle = '';
    defaultLang = 'en';

    constructor(
        private timeoutService: SessionTimeoutService,
        private translate: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title) {

        const sessionLang = localStorage.getItem('lang');
        const lang = sessionLang || this.defaultLang;
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
    }

    async ngOnInit() {
        if (environment.production) {
            this.timeoutService.setTimeout();
        }

        await this.setTitle();
    }

    async setTitle() {
        this.appTitle = await lastValueFrom(this.translate.get('app_title'));
        this.titleService.setTitle(this.appTitle);

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(() => {

            function getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
                if (activatedRoute.firstChild) {
                    return getChild(activatedRoute.firstChild);
                } else {
                    return activatedRoute;
                }
            }

            var route = getChild(this.activatedRoute)
            route.data.subscribe(data => {
                const title = data.title;
                if (title) {
                    this.appTitle = this.translate.instant('app_title');
                    let fullTitle = `${this.appTitle}`;
                    if (title !== 'app_title') {
                        const translatedTitle = this.translate.instant(title);
                        fullTitle += ` | ${translatedTitle}`
                    }
                    this.titleService.setTitle(fullTitle);
                }
            })
        });
    }
}
