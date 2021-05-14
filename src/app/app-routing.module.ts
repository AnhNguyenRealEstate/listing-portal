import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingSearchComponent } from './components/listing-search/listing-search.componen';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'listings', component: ListingSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }