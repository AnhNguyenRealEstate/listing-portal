import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingUploadComponent } from './listing-upload/listing-upload.component';
import { ListingEditComponent } from './listing-edit/listing-edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RTEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ListingUploadDialogComponent } from './listing-upload/listing-upload-dialog.component';
import { ListingEditRoutingModule } from './listing-edit-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadSpinnerModule } from '../load-spinner/load-spinner.module';

@NgModule({
  declarations: [
    ListingUploadComponent,
    ListingUploadDialogComponent,
    ListingEditComponent,
    RTEditorComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ListingEditRoutingModule,
    EditorModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    TranslateModule.forChild({
      extend: true
    }),
    LoadSpinnerModule
  ],
  exports: [
    ListingUploadComponent,
    ListingEditComponent,
    ListingUploadDialogComponent,
    RTEditorComponent
  ]
})
export class ListingEditModule { }
