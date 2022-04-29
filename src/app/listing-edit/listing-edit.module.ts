import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingEditComponent } from './listing-edit/listing-edit.component';
import { ListingEditRoutingModule } from './listing-edit-routing.module';
import { ConfirmationDialogComponent } from './confirmation/confirmation-dialog.component';
import { ListingEditCardComponent } from './listing-edit-card/listing-edit-card.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { ListingUploadModule } from '../listing-upload/listing-upload.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ListingEditComponent,
    ConfirmationDialogComponent,
    ListingEditCardComponent
  ],
  imports: [
    CommonModule,
    ListingEditRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ListingUploadModule,
    NgxPageScrollCoreModule,
    TranslateModule.forChild({
      extend: true
    }),
    MatTooltipModule
  ],
  exports: [
  ]
})
export class ListingEditModule { }
