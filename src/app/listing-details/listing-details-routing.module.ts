import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingDetailsComponent } from './listing-details.component';
import { ListingDetailsNotFound } from './not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        component: ListingDetailsComponent
    },
    {
        path: 'not-found',
        component: ListingDetailsNotFound
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListingDetailsRoutingModule { }