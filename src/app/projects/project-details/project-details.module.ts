import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListingCardModule } from 'src/app/listing-card/listing-card.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectDetailsRoutingModule } from './project-details-routing.module';

import { ProjectDetailsComponent } from './project-details.component';
import { ProjectListingSearchModule } from './project-listing-search/listing-search.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ProjectDetailsRoutingModule,
        TranslateModule.forChild({
            extend: true
        }),
        ListingCardModule,
        ProjectListingSearchModule
    ],
    exports: [ProjectDetailsComponent],
    declarations: [ProjectDetailsComponent],
})
export class ProjectDetailsModule { }
