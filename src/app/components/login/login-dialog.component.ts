import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: 'login-dialog.component.html'
})

export class LoginComponent implements OnInit {
    userName: string = '';
    password: string = '';

    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        public auth: AngularFireAuth) { }

    ngOnInit() {
        // use firebase here to ask user to sign in
    }

    login() {
        this.auth
            .signInWithEmailAndPassword(this.userName, this.password)
            .then(response => {
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