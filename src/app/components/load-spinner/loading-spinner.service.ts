import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingSpinnerService {
    isLoading$$ = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoading$$.asObservable();

    constructor() {

    }

    startLoadingSpinner() {
        this.isLoading$$.next(true);
    }

    stopLoadingSpinner() {
        this.isLoading$$.next(false);
    }
}