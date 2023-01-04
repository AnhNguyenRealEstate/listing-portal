import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingSearchComponent } from './listing-search.component';

const routes: Routes = [
    {
        path: '',
        component: ListingSearchComponent
    },
    {
        path: 'details/:listingId',
        loadChildren: () => import('src/app/listing-details/listing-details.module').then(mod => mod.ListingDetailsModule)
    },
    { path: '**', redirectTo: '/listings' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListingSearchRoutingModule { }