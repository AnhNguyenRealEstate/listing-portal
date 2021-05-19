import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { ListingSearchService } from './components/listing-search/listing-search.service';
import { SearchBarComponent } from './components/listing-search/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { SideNavComponent } from './components/sidenav/sidenav.component';
import { ListingSearchComponent } from './components/listing-search/listing-search.componen';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';;
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { ListingLocationService } from './components/listing-search/listing-location-data.service';
import { LoadingSpinnerService } from './components/load-spinner/loading-spinner.service';
import { LoadingInterceptorService } from './shared/loading-interceptor.service';
import { LoadingSpinnerComponent } from './components/load-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarouselComponent,
    NavBarComponent,
    SearchBarComponent,
    SideNavComponent,
    ListingSearchComponent,
    ListingDetailsComponent,
    LoadingSpinnerComponent
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
    InfiniteScrollModule
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
