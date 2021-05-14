import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
              <app-navbar></app-navbar>
              <router-outlet></router-outlet>
              <footer class="d-flex justify-content-center pt-5 pb-4">
                  <span>Copyright @ Anh Nguyen Real Estate. All Rights Reserverd.</span>
              </footer>
            `
})
export class AppComponent {
  title = 'listing-portal';
}
