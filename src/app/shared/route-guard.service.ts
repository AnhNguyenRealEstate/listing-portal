import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {
    private loggedIn$$ = new BehaviorSubject<boolean>(false);
    loggedIn$ = this.loggedIn$$.asObservable();

    constructor(private auth: AngularFireAuth, private router: Router) {
        this.auth.authState.subscribe(user => {
            this.loggedIn$$.next(!!user);
        });
    }

    canActivate(): Observable<boolean> {
        return this.auth.authState.pipe(
            map(user => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/']);
                    return false;
                }
            })
        );
    }
}