import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionTimeoutService } from './components/session-timeout/session-timeout.service';

@Component({
  selector: 'app-root',
  template: ` 
              <app-layout></app-layout>
            `
})
export class AppComponent implements OnInit {
  title = 'Anh Nguyen Real Estate';

  constructor(
    private timeoutService: SessionTimeoutService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.timeoutService.setTimeout();
    this.translate.setDefaultLang('en');
  }
}
