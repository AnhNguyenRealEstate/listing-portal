import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './load-spinner.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptorService } from './interceptor.service';


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
