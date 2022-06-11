import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { PropertiesViewComponent } from './properties-view/properties-view.component';
import { PropertyManagementComponent } from './property-management.component';

const routes: Routes = [
    {
        path: '',
        component: PropertyManagementComponent,
        children: [
            {
                path: 'properties-view',
                component: PropertiesViewComponent,
                outlet: 'property-management-outlet'
            },
            {
                path: 'activities',
                component: ActivitiesComponent,
                outlet: 'property-management-outlet'
            }
        ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PropertyManagementRoutingModule { }