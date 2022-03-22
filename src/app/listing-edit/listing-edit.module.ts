import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingUploadComponent } from './listing-upload/listing-upload.component';
import { ListingEditComponent } from './listing-edit/listing-edit.component';
import { RTEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { ListingUploadDialogComponent } from './listing-upload/listing-upload-dialog.component';
import { ListingEditRoutingModule } from './listing-edit-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
  declarations: [
    ListingUploadComponent,
    ListingUploadDialogComponent,
    ListingEditComponent,
    RTEditorComponent
  ],
  imports: [
    CommonModule,
    ListingEditRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      extend: true
    }),
    NgxMaskModule.forChild()
  ],
  exports: [
    ListingUploadComponent,
    ListingEditComponent,
    ListingUploadDialogComponent,
    RTEditorComponent
  ]
})
export class ListingEditModule { }
