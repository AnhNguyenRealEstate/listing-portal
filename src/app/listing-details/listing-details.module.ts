import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { ListingDetailsRoutingModule } from './listing-details-routing.module';
import { ListingDetailsComponent } from './listing-details.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatIconModule } from '@angular/material/icon';
import { FooterModule } from '../footer/footer.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ListingDetailsNotFound } from './not-found/not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [ListingDetailsComponent, ListingDetailsNotFound],
    imports: [
        CommonModule,
        ListingDetailsRoutingModule,
        NgImageSliderModule,
        TranslateModule.forChild({
            extend: true
        }),
        NgxUsefulSwiperModule,
        NgxMaskModule.forChild(),
        FooterModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatTabsModule,
        MatCardModule
    ]
})
export class ListingDetailsModule { }

