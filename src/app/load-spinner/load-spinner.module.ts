import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './load-spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [LoadingSpinnerComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  exports: [LoadingSpinnerComponent]
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
  // ]
})
export class LoadSpinnerModule { }
