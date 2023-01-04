import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';

import { ProjectComponent } from './project.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({ extend: true }),
        SharedModule,
        ProjectRoutingModule
    ],
    exports: [ProjectComponent],
    declarations: [ProjectComponent]
})
export class ProjectModule { }
