import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { ListingDetailsRoutingModule } from './listing-details-routing.module';
import { ListingDetailsComponent } from './listing-details.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FooterModule } from '../footer/footer.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [ListingDetailsComponent],
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
        MatProgressSpinnerModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule
    ]
})
export class ListingDetailsModule { }

