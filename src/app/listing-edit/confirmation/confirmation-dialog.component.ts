import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'confirmation',
    templateUrl: 'confirmation-dialog.component.html'
})

export class ConfirmationDialogComponent {
    message: string = '';
    yesBtnText: string = '';
    noBtnText: string = '';

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.message = this.data.message;
        this.yesBtnText = this.data.yesBtnText;
        this.noBtnText = this.data.noBtnText;
    }

    decisionMade(isYes: boolean) {
        this.dialogRef.close(isYes);
    }
}