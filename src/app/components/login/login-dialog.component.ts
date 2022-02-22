import { Component } from '@angular/core';
import { Auth, browserSessionPersistence, signInWithEmailAndPassword } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: 'login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})

export class LoginComponent {
    userName: string = '';
    password: string = '';
    hide: boolean = true;
    successful: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        public auth: Auth,
        private translateService: TranslateService) { }

    async login() {
        await this.auth.setPersistence(browserSessionPersistence);
        await signInWithEmailAndPassword(this.auth, this.userName, this.password).catch(error => {
            this.successful = false;
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case 'auth/wrong-password':
                case 'auth/invalid-email':
                    alert(this.translateService.instant('login.wrong_email_pw'));
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