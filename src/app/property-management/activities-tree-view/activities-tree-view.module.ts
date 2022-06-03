import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

import { ActivitiesTreeviewComponent } from './activities-tree-view.component';

@NgModule({
    declarations: [ActivitiesTreeviewComponent],
    imports: [
        CommonModule,
        SharedModule,
        MatExpansionModule
    ],
    exports: [ActivitiesTreeviewComponent]
})
export class ActivitiesTreeviewModule { }
