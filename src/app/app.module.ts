import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/listing-search/search-bar/search-bar.component';
import { ListingSearchComponent } from './components/listing-search/listing-search.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SearchBarDialogComponent } from './components/listing-search/search-bar/search-bar-dialog.component';
import { ListingDetailsDialogComponent } from './components/listing-search/listing-details/listing-details-dialog.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { LoginComponent } from './components/login/login-dialog.component';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics } from "@angular/fire/analytics";
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SearchResultsComponent } from './components/listing-search/search-results/search-results.component';
import { ListingLocationComponent } from './components/listing-search/listing-location/listing-location.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { TimeoutComponent } from './components/session-timeout/session-timeout.component';

import { firebaseConfig } from './shared/globals';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage } from '@firebase/storage';
import { connectStorageEmulator, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ListingEditModule } from './listing-edit/listing-edit.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarouselComponent,
    SearchBarComponent,
    ListingSearchComponent,
    ListingDetailsComponent,
    AboutUsComponent,
    LayoutComponent,
    SearchBarDialogComponent,
    SearchResultsComponent,
    ListingDetailsDialogComponent,
    LoginComponent,
    ListingLocationComponent,
    TimeoutComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ListingEditModule,
    NgxPageScrollCoreModule, 
    NgIdleKeepaliveModule.forRoot(),
    NgImageSliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (!environment.production) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (!environment.production) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (!environment.production) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideAnalytics(() => getAnalytics(getApp())),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
