import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` 
              <app-layout></app-layout>
              <footer class="d-flex justify-content-center pt-4 pb-4 footer">
                <span>Copyright @ Anh Nguyen Real Estate. All Rights Reserverd.</span>
              </footer>
            `
})
export class AppComponent {
  title = 'Anh Nguyen Real Estate';
}
