import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingUploadComponent } from './listing-upload.component';
import { RTEditorModule } from '../rich-text-editor/rich-text-editor.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListingUploadComponent
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
    MatAutocompleteModule,
    MatChipsModule,
    MatStepperModule,
    ReactiveFormsModule
  ],
  exports: [
    ListingUploadComponent
  ]
})
export class ListingUploadModule {
  constructor() { }

  getListingUploadComponent() {
    return ListingUploadComponent;
  }
}