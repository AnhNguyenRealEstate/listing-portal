import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingLocationComponent } from './listing-location/listing-location.component';
import { ListingSearchComponent } from './listing-search.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListingSearchRoutingModule } from './listing-search-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatExpansionModule } from '@angular/material/expansion';
import { ListingCardModule } from '../listing-card/listing-card.module';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { MatMenuModule } from '@angular/material/menu';
import { NumberToVNDPipe } from '../shared/custom-pipes';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    SearchBarComponent,
    ListingSearchComponent,
    SearchResultsComponent,
    ListingLocationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ListingSearchRoutingModule,
    TranslateModule.forChild({
      extend: true
    }),
    GoogleMapsModule,
    MatExpansionModule,
    MatMenuModule,
    ListingCardModule,
    NgxPageScrollCoreModule,
    NumberToVNDPipe,
    MatButtonToggleModule,
    MatAutocompleteModule
  ],
  exports: [
    ListingSearchComponent
  ]
})
export class ListingSearchModule { }
