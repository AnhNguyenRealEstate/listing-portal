import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { ListingSearchComponent } from './components/listing-search/listing-search.component';
import { ListingUploadComponent } from './components/listing-upload/listing-upload.component';

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
  },
  {
    path: 'listing-upload',
    component: ListingUploadComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }