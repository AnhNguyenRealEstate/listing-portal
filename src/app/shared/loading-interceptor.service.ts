import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoadingSpinnerService } from '../components/load-spinner/loading-spinner.service';

@Injectable({ providedIn: 'root' })
export class LoadingInterceptorService implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

    constructor(private loadingSpinnerService: LoadingSpinnerService) {

    }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        this.requests.splice(i, 1);
        this.loadingSpinnerService.isLoading$$.next(this.requests.length > 0);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requests.push(req);
        this.loadingSpinnerService.isLoading$$.next(true);
        return new Observable(observer => {
            const subscription = next.handle(req).subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        this.removeRequest(req);
                        observer.next(event);
                    }
                },
                err => { this.removeRequest(req); observer.error(err); },
                () => { this.removeRequest(req); observer.complete(); });
            // teardown logic in case of cancelled requests
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        });
    }
}