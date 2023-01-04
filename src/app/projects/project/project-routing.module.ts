import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';

export const routes: Routes = [
    {
        path: '',
        component: ProjectComponent
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
export class ProjectRoutingModule { }