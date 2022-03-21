import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

/** 
 * On start up, determines which subordinates to get reports
 * 
 * Query for those reports, organize by reporting date
 * 
 * For each date, organize by author
 */
@Injectable({ providedIn: 'any' })
export class EmployeeReportingService {
    constructor(private auth: Auth) { }

    submitReport() {
        if (!this.auth.currentUser) { return; }

        const userMail = this.auth.currentUser?.email;
        
    }

    saveEdit() {
        if (!this.auth.currentUser) { return; }

        const userMail = this.auth.currentUser?.email;
    }

}