import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectShowcaseComponent } from './project-showcase.component';

export const routes: Routes = [
    {
        path: '',
        component: ProjectShowcaseComponent
    },
    {
        path: 'project/:projectId',
        loadChildren: () => import('src/app/projects/project/project.module').then(mod => mod.ProjectModule)
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