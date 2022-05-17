import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'app_title' }
  },
  {
    path: 'listings',
    loadChildren: () => import('./listing-search/listing-search.module').then(mod => mod.ListingSearchModule),
    data: { title: 'layout.listings' }
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then(mod => mod.AboutUsModule),
    data: { title: 'layout.about_us' }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }