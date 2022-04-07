import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCardComponent } from './listing-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ListingCardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule.forChild({
      extend: true
    }),
    ClipboardModule
  ],
  exports: [ListingCardComponent]
})
export class ListingCardModule { }
