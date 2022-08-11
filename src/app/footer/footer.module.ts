import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer.component';

@NgModule({
    declarations: [FooterComponent],
    imports: [CommonModule, TranslateModule, MatIconModule, MatDividerModule],
    exports: [FooterComponent]
})
export class FooterModule { }
