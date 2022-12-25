import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCardComponent } from './listing-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyAutocompleteModule as MatAutocompleteModule, MAT_LEGACY_AUTOCOMPLETE_SCROLL_STRATEGY as MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/legacy-autocomplete';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { MatLegacyMenuModule as MatMenuModule, MAT_LEGACY_MENU_SCROLL_STRATEGY as MAT_MENU_SCROLL_STRATEGY } from '@angular/material/legacy-menu';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyChipsModule as MatChipsModule, MAT_LEGACY_CHIPS_DEFAULT_OPTIONS as MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/legacy-chips';
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