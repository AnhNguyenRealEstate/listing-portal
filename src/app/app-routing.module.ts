import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { ListingSearchComponent } from './components/listing-search/listing-search.componen';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'listings',
    component: ListingSearchComponent,
    children: [
      {
        path: 'details/:listingId',
        component: ListingDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }