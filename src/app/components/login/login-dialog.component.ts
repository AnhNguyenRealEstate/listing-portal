import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: 'login-dialog.component.html'
})

export class LoginComponent {
    userName: string = '';
    password: string = '';
    hide: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        public auth: AngularFireAuth) { }

    login() {
        this.auth
            .signInWithEmailAndPassword(this.userName, this.password)
            .then(() => {
                this.dialogRef.close(true);
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
            })
    }
}