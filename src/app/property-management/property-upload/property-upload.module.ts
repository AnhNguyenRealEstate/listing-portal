import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { RTEditorModule } from 'src/app/rich-text-editor/rich-text-editor.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PropertyUploadComponent } from './property-upload.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [PropertyUploadComponent],
    imports: [
        CommonModule,
        RTEditorModule,
        SharedModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            extend: true
        }),
        NgxMaskModule.forChild(),
        DragDropModule,
        MatDatepickerModule
    ],
    exports: [PropertyUploadComponent]
})
export class PropertyUploadModule {
    constructor() { }

    getPropertyUploadModule() {
        return PropertyUploadComponent;
    }
}
