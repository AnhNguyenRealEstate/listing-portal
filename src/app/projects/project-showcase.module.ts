import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ProjectShowcaseRoutingModule } from './project-showcase-routing.module';

import { ProjectShowcaseComponent } from './project-showcase.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule.forChild({ extend: true }),
        ProjectShowcaseRoutingModule
    ],
    exports: [ProjectShowcaseComponent],
    declarations: [ProjectShowcaseComponent]
})
export class ProjectShowcaseModule { }
