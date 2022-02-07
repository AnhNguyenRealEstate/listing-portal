import { Component } from '@angular/core';
import { Auth, browserSessionPersistence, signInWithEmailAndPassword } from '@angular/fire/auth';
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
        public auth: Auth) { }

    async login() {
        await this.auth.setPersistence(browserSessionPersistence);
        await signInWithEmailAndPassword(this.auth, this.userName, this.password).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
        });
        this.dialogRef.close(true);
    }
}