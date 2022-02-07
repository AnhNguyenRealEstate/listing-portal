import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {
    private loggedIn$$ = new BehaviorSubject<boolean>(false);
    loggedIn$ = this.loggedIn$$.asObservable();

    constructor(private auth: Auth, private router: Router) {
        this.auth.onAuthStateChanged(user => {
            this.loggedIn$$.next(!!user);
        });
    }

    canActivate(): Observable<boolean> {
        return new Observable(this.auth.onAuthStateChanged(user => {
            if (user) {
                return true;
            } else {
                this.router.navigate(['/']);
                return false;
            }
        }));
    }
}