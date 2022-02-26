import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingDetailsComponent } from './listing-details/listing-details.component';
import { ListingSearchComponent } from './listing-search.component';

const routes: Routes = [
    {
        path: '',
        component: ListingSearchComponent
    },
    {
        path: 'details/:listingId',
        component: ListingDetailsComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListingSearchRoutingModule { }