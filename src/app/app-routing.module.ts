import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/listing-search/listing-details/listing-details.component';
import { ListingSearchComponent } from './components/listing-search/listing-search.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

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
    path: 'listing-edit',
    loadChildren: () => import('./listing-edit/listing-edit.module').then(mod => mod.ListingEditModule),
    canActivate: [
      AuthGuard
    ],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['/']) }
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }