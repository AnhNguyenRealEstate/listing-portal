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
    ListingDetailsDialogComponent
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
    NgxScrollTopModule
  ],
  providers: [
    ListingSearchService,
    ListingLocationService,
    LoadingSpinnerService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
