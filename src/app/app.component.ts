import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` 
              <div>
                <app-layout></app-layout>
              </div>

              <footer class="d-flex justify-content-center pt-4 pb-4">
                  <span>Copyright @ Anh Nguyen Real Estate. All Rights Reserverd.</span>
              </footer>
            `
})
export class AppComponent {
  title = 'Anh Nguyen Real Estate';
}
