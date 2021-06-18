import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService implements CanActivate {
    private loggedIn$$ = new BehaviorSubject<boolean>(false);
    loggedIn$ = this.loggedIn$$.asObservable();

    constructor(private auth: AngularFireAuth) {
        this.auth.authState.subscribe(user => {
            this.loggedIn$$.next(!!user?.email);
        });;
    }

    canActivate() {
        const loggedIn = this.loggedIn$$.value;
        return loggedIn;
    }
}