import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { SharedModule } from 'src/app/shared/shared.module';

import { ActivitiesTreeviewComponent } from './activities-tree-view.component';

@NgModule({
    declarations: [ActivitiesTreeviewComponent],
    imports: [
        CommonModule,
        SharedModule,
        MatTreeModule
    ],
    exports: [ActivitiesTreeviewComponent]
})
export class ActivitiesTreeviewModule { }
