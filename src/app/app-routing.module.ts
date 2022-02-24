import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'listings',
    loadChildren: () => import('./listing-search/listing-search.module').then(mod => mod.ListingSearchModule),
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