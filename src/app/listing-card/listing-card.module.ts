import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCardComponent } from './listing-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { MatMenuModule, MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDividerModule } from '@angular/material/divider';

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
    ClipboardModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule
  ],
  exports: [ListingCardComponent],
  providers: [
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    { provide: MAT_CHIPS_DEFAULT_OPTIONS, useValue: { separatorKeyCodes: [COMMA, ENTER] } }
  ]
})
export class ListingCardModule { }

export function scrollFactory(overlay: Overlay): () => NoopScrollStrategy {
  return () => overlay.scrollStrategies.noop();
}