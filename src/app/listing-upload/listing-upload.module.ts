import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingUploadDialogComponent } from './listing-upload-dialog.component';
import { ListingUploadComponent } from './listing-upload.component';
import { RTEditorModule } from '../rich-text-editor/rich-text-editor.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ListingUploadComponent,
    ListingUploadDialogComponent,
  ],
  imports: [
    CommonModule,
    RTEditorModule,
    SharedModule,
    TranslateModule.forChild({
      extend: true
    }),
    NgxMaskModule.forChild(),
    DragDropModule,
    MatBadgeModule,
    MatAutocompleteModule
  ],
  exports: [
    ListingUploadComponent,
    ListingUploadDialogComponent,
  ]
})
export class ListingUploadModule { }
