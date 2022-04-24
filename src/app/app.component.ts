import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FacebookService } from 'ngx-facebook';
import { lastValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SessionTimeoutService } from './components/session-timeout/session-timeout.service';

@Component({
  selector: 'app-root',
  template: `<app-layout></app-layout>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  appTitle = '';

  constructor(
    private timeoutService: SessionTimeoutService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private facebook: FacebookService) {
  }

  async ngOnInit() {
    this.facebook.init({
      xfbml: true,
      version: 'v13.0'
    });
    
    this.timeoutService.setTimeout();

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
      route.data.subscribe(async data => {
        const title = data.title;
        if (title) {
          this.appTitle = await lastValueFrom(this.translate.get('app_title'));
          const translatedTitle = await lastValueFrom(this.translate.get(title));
          this.titleService.setTitle(`${this.appTitle} | ${translatedTitle}`);
        }
      })
    });
  }

  async ngAfterViewInit() {
    this.appTitle = await lastValueFrom(this.translate.get('app_title'));
    this.titleService.setTitle(this.appTitle);
  }
}
