import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { lastValueFrom, Subscription } from 'rxjs';
import { RolesService } from 'src/app/shared/roles.service';
import { Activity } from '../property-management.data';
import { ActivitiesService } from './activities.service';

@Component({
    selector: 'activities',
    templateUrl: 'activities.component.html'
})

export class ActivitiesComponent implements OnInit, OnDestroy {
    activities: Activity[] = [];
    subs: Subscription = new Subscription();

    constructor(
        private activitiesService: ActivitiesService,
        private auth: Auth,
        private roles: RolesService
    ) { }

    async ngOnInit() {

        this.subs.add(this.roles.roles$.subscribe(async roles => {
            if (roles.includes('customer-service')) {
                const snapshot = await this.activitiesService.getActivities();
                this.activities = snapshot.docs.map(doc => doc.data() as Activity);
            } else if (roles.includes('owner') && this.auth.currentUser?.email) {
                const snapshot = await this.activitiesService.getActivities(this.auth.currentUser.email);
                this.activities = snapshot.docs.map(doc => doc.data() as Activity);
            }
        }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}