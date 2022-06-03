import { FlatTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Activity, UploadedFile } from '../property-management.data';


/** Flat node with expandable and level information */
interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: 'activities-tree-view',
    templateUrl: 'activities-tree-view.component.html',
    styleUrls: ['./activities-tree-view.component.scss']
})

export class ActivitiesTreeviewComponent implements OnInit {
    @Input() activities: Activity[] = [];

    private _transformer = (node: Activity, level: number) => {
        return {
            expandable: !!node.documents && node.documents.length > 0,
            name: `${node.date?.toDate()} - ${node.description}`,
            level: level
        };
    };

    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => null
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor() {
    }

    ngOnInit() {
        this.dataSource.data = this.activities;
    }

    hasChild = (_: number, node: FlatNode) => node.expandable;
}