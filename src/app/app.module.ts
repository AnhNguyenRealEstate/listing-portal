import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login-dialog.component';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics } from "@angular/fire/analytics";
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TimeoutComponent } from './components/session-timeout/session-timeout.component';
import { firebaseConfig } from './shared/globals';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage } from '@firebase/storage';
import { connectStorageEmulator, provideStorage } from '@angular/fire/storage';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ListingCardModule } from './listing-card/listing-card.module';
import { MatSidenavModule } from '@angular/material/sidenav';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    TimeoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    MatSidenavModule,
    ListingCardModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxMaskModule.forRoot(maskConfig),
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      return app;
    }),
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
    provideAnalytics(() => getAnalytics(getApp()))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
