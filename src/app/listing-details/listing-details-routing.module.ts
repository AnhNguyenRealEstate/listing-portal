import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingDetailsComponent } from './listing-details.component';

const routes: Routes = [
    {
        path: '',
        component: ListingDetailsComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListingDetailsRoutingModule { }