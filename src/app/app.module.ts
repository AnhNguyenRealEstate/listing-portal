import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { ListingSearchService } from './components/listing-search/listing-search.service';
import { SearchBarComponent } from './components/listing-search/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { ListingSearchComponent } from './components/listing-search/listing-search.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';;
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { ListingLocationService } from './components/listing-search/listing-location-data.service';
import { LoadingSpinnerService } from './components/load-spinner/loading-spinner.service';
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
import { SearchBarDialogComponent } from './components/listing-search/search-bar/search-bar-dialog.component';
import { ListingDetailsDialogComponent } from './components/listing-search/listing-details/listing-details-dialog.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { LoginComponent } from './components/login/login-dialog.component';
import { ListingUploadComponent } from './components/listing-upload/listing-upload.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { PERSISTENCE } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1XM_nSp9m-vmO2FiDA8IyARQEAMEPJyA",
  authDomain: "listing-portal.firebaseapp.com",
  projectId: "listing-portal",
  storageBucket: "listing-portal.appspot.com",
  messagingSenderId: "915781263857",
  appId: "1:915781263857:web:b86316bef0494007f22450",
  measurementId: "G-HRX75EES2C"
};

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
    ListingDetailsDialogComponent,
    LoginComponent,
    ListingUploadComponent
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
    InfiniteScrollModule,
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
    NgxPageScrollCoreModule,
    NgxScrollTopModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [
    ListingSearchService,
    ListingLocationService,
    LoadingSpinnerService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
    { provide: PERSISTENCE, useValue: 'session' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
