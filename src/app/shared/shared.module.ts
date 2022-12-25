import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectConfig as MatSelectConfig, MatLegacySelectModule as MatSelectModule, MAT_LEGACY_SELECT_CONFIG as MAT_SELECT_CONFIG } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterModule } from '../footer/footer.module';
import { LoadSpinnerModule } from '../load-spinner/load-spinner.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
    exports: [
        FormsModule,
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
        MatSnackBarModule,
        LoadSpinnerModule,
        FooterModule,
        NgxTrimDirectiveModule,
        MatTooltipModule
    ],
    providers: [
        CurrencyPipe,
        {
            provide: MAT_SELECT_CONFIG,
            useValue: {
                disableOptionCentering: true
            } as MatSelectConfig
        },
    ]
})
export class SharedModule { }
