import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingSpinnerService {
    isLoading = new BehaviorSubject<boolean>(false);

    constructor() {

    }
}