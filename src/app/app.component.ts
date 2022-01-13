import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SessionTimeoutService } from './components/session-timeout/session-timeout.service';

@Component({
  selector: 'app-root',
  template: ` 
              <app-layout></app-layout>
              <footer class="d-flex justify-content-center pt-4 pb-4 footer">
                <span>Copyright @ Anh Nguyen Real Estate. All Rights Reserverd.</span>
              </footer>
            `
})
export class AppComponent implements OnInit {
  title = 'Anh Nguyen Real Estate';

  constructor(
    private timeoutService: SessionTimeoutService) {
  }

  ngOnInit() {
    this.timeoutService.setTimeout();
  }
}
