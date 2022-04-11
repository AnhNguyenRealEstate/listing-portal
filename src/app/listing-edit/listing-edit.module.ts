import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingUploadComponent } from './listing-upload/listing-upload.component';
import { ListingEditComponent } from './listing-edit/listing-edit.component';
import { ListingUploadDialogComponent } from './listing-upload/listing-upload-dialog.component';
import { ListingEditRoutingModule } from './listing-edit-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask'
import { RTEditorModule } from '../rich-text-editor/rich-text-editor.module';
import { ConfirmationDialogComponent } from './confirmation/confirmation-dialog.component';
import { ListingEditCardComponent } from './listing-edit-card/listing-edit-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ListingUploadComponent,
    ListingUploadDialogComponent,
    ListingEditComponent,
    ConfirmationDialogComponent,
    ListingEditCardComponent
  ],
  imports: [
    CommonModule,
    ListingEditRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      extend: true
    }),
    NgxMaskModule.forChild(),
    RTEditorModule,
    DragDropModule
  ],
  exports: [
  ]
})
export class ListingEditModule { }
