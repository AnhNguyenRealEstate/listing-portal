import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectShowcaseComponent } from './project-showcase.component';

export const routes: Routes = [
    {
        path: '',
        component: ProjectShowcaseComponent
    },
    {
        path: 'details/:projectId',
        loadChildren: () => import('src/app/projects/project-details/project-details.module').then(mod => mod.ProjectDetailsModule)
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
export class ProjectShowcaseRoutingModule { }