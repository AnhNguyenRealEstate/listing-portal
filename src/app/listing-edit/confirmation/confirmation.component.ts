import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'confirmation',
    templateUrl: 'confirmation.component.html'
})

export class ConfirmationComponent implements OnInit {
    message: string = '';
    yesBtnText: string = '';
    noBtnText: string = '';

    constructor(
        public dialogRef: MatDialogRef<ConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.message = this.data.message;
        this.yesBtnText = this.data.yesBtnText;
        this.noBtnText = this.data.noBtnText;
    }

    ngOnInit() { }

    decisionMade(isYes: boolean) {
        this.dialogRef.close(isYes);
    }
}