import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';

import { ProjectCardComponent } from './project-card.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({ extend: true }),
        SharedModule
    ],
    exports: [ProjectCardComponent],
    declarations: [ProjectCardComponent]
})
export class ProjectModule { }
