import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingEditComponent } from './listing-edit/listing-edit.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
    {
        path: '',
        component: ListingEditComponent,
        canActivate: [
            AuthGuard
        ],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['/']) }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListingEditRoutingModule { }