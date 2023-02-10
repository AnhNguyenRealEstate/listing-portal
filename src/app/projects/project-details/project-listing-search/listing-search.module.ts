import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingSearchComponent } from './listing-search.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TranslateModule } from '@ngx-translate/core';
import { ListingSearchRoutingModule } from './listing-search-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { MatMenuModule } from '@angular/material/menu';
import { ListingCardModule } from 'src/app/listing-card/listing-card.module';
import { NumberToVNDPipe } from 'src/app/shared/custom-pipes';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    SearchBarComponent,
    ListingSearchComponent,
    SearchResultsComponent
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
    MatButtonToggleModule
  ],
  exports: [
    ListingSearchComponent
  ]
})
export class ProjectListingSearchModule { }
