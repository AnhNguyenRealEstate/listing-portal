import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingDetailsComponent } from './listing-details/listing-details.component';
import { ListingLocationComponent } from './listing-location/listing-location.component';
import { ListingSearchComponent } from './listing-search.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListingSearchRoutingModule } from './listing-search-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { NgxMaskModule } from 'ngx-mask';
import { ListingCardModule } from '../listing-card/listing-card.module';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    SearchBarComponent,
    ListingSearchComponent,
    ListingDetailsComponent,
    SearchResultsComponent,
    ListingLocationComponent
  ],
  imports: [
    CommonModule,
    NgImageSliderModule,
    SharedModule,
    ListingSearchRoutingModule,
    TranslateModule.forChild({
      extend: true
    }),
    GoogleMapsModule,
    MatExpansionModule,
    NgxUsefulSwiperModule,
    NgxMaskModule.forChild(),
    ListingCardModule,
    InfiniteScrollModule
  ],
  exports: [
  ]
})
export class ListingSearchModule { }
