import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FooterModule } from '../footer/footer.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AboutUsRoutingModule,
    MatDividerModule,
    MatCardModule,
    TranslateModule.forChild(),
    FooterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxTrimDirectiveModule
  ]
})
export class AboutUsModule { }
