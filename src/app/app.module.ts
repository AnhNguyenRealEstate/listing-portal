import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/listing-search/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { ListingSearchComponent } from './components/listing-search/listing-search.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { LoadingInterceptorService } from './shared/loading-interceptor.service';
import { LoadingSpinnerComponent } from './components/load-spinner/loading-spinner.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'
import { LayoutComponent } from './components/layout/layout.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchBarDialogComponent } from './components/listing-search/search-bar/search-bar-dialog.component';
import { ListingDetailsDialogComponent } from './components/listing-search/listing-details/listing-details-dialog.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { LoginComponent } from './components/login/login-dialog.component';
import { ListingUploadComponent } from './components/listing-upload/listing-upload.component';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SearchResultsComponent } from './components/listing-search/search-results/search-results.component';
import { ListingLocationComponent } from './components/listing-search/listing-location/listing-location.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ListingEditComponent } from './components/listing-edit/listing-edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RTEditorComponent } from './components/rich-text-editor/rich-text-editor.component';
import { TimeoutComponent } from './components/session-timeout/session-timeout.component';
import { ListingUploadDialogComponent } from './components/listing-upload/listing-upload-dialog.component';
import { NgxImageCompressService } from "ngx-image-compress";
import { firebaseConfig } from './shared/globals';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarouselComponent,
    SearchBarComponent,
    ListingSearchComponent,
    ListingDetailsComponent,
    LoadingSpinnerComponent,
    AboutUsComponent,
    LayoutComponent,
    SearchBarDialogComponent,
    SearchResultsComponent,
    ListingDetailsDialogComponent,
    LoginComponent,
    ListingUploadComponent,
    ListingEditComponent,
    ListingLocationComponent,
    ContactUsComponent,
    RTEditorComponent,
    TimeoutComponent,
    ListingUploadDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    NgxPageScrollCoreModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    NgIdleKeepaliveModule.forRoot(),
    NgImageSliderModule,
    EditorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
    NgxImageCompressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
