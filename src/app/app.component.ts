import { Component, OnInit } from '@angular/core';
import { SessionTimeoutService } from './components/session-timeout/session-timeout.service';

@Component({
  selector: 'app-root',
  template: `<app-layout></app-layout>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Anh Nguyen Real Estate Ltd';

  constructor(
    private timeoutService: SessionTimeoutService) {
  }

  ngOnInit() {
    this.timeoutService.setTimeout();
  }
}
