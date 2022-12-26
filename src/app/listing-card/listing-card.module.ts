import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCardComponent } from './listing-card.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule, MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

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