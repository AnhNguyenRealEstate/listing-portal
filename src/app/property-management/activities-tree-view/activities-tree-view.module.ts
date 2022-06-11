import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

import { ActivitiesTreeviewComponent } from './activities-tree-view.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ActivitiesTreeviewComponent],
    imports: [
        CommonModule,
        SharedModule,
        MatExpansionModule,
        TranslateModule.forChild(
            { extend: true }
        )
    ],
    exports: [ActivitiesTreeviewComponent]
})
export class ActivitiesTreeviewModule { }