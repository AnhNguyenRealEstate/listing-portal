import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { LoadSpinnerModule } from '../load-spinner/load-spinner.module';



@NgModule({
    exports: [
        NgbModule,
        FormsModule,
        MatSidenavModule,
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
        LoadSpinnerModule,
        EditorModule,
        NgxPageScrollCoreModule
    ],
    providers: [CurrencyPipe]
})
export class SharedModule { }
