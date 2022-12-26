import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterModule } from '../footer/footer.module';
import { LoadSpinnerModule } from '../load-spinner/load-spinner.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectConfig, MatSelectModule, MAT_SELECT_CONFIG } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    exports: [
        FormsModule,
        MatFormFieldModule,
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
        }
    ]
})
export class SharedModule { }
