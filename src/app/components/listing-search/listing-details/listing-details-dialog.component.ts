import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-listing-details-dialog',
    templateUrl: 'listing-details-dialog.component.html'
})

export class ListingDetailsDialogComponent {
    constructor(public dialogRef: MatDialogRef<ListingDetailsDialogComponent>) { }

    closeDialog() {
        debugger;
        this.dialogRef.close();
    }
}