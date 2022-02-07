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
    successful: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        public auth: Auth) { }

    async login() {
        await this.auth.setPersistence(browserSessionPersistence);
        await signInWithEmailAndPassword(this.auth, this.userName, this.password).catch(error => {
            this.successful = false;
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case 'auth/wrong-password':
                case 'auth/invalid-email':
                    alert('Please enter valid username/password');
                    break;
                default:
                    alert(errorMessage);
            }
        });

        if (this.successful) {
            this.dialogRef.close(true);
        }
    }
}