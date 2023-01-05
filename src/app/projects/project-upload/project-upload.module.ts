import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { RTEditorModule } from 'src/app/rich-text-editor/rich-text-editor.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProjectUploadComponent } from './project-upload.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule.forChild({ extend: true }),
        RTEditorModule,
        MatBadgeModule,
        DragDropModule
    ],
    exports: [ProjectUploadComponent],
    declarations: [ProjectUploadComponent]
})
export class ProjectUploadModule { }
