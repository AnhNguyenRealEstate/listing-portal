import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadSpinnerService {
    isLoading$$ = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoading$$.asObservable();

    constructor() {

    }

    start() {
        this.isLoading$$.next(true);
    }

    stop() {
        this.isLoading$$.next(false);
    }
}