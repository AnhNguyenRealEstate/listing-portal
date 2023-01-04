import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details.component';

export const routes: Routes = [
    {
        path: '',
        component: ProjectDetailsComponent
    },
    {
        path: '**',
        redirectTo: '/projects'
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ProjectDetailsRoutingModule { }