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
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';;
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarouselComponent,
    NavBarComponent,
    SearchBarComponent,
    SideNavComponent,
    ListingSearchComponent
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
  providers: [ListingSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
