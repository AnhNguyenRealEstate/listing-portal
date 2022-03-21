import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { EmployeeReportingComponent } from './employee-reporting.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeReportingComponent,
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
export class EmployeeReportingRoutingModule { }