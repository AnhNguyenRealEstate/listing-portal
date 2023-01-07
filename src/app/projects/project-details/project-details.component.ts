import { Component, createNgModule, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/components/login/login.service';
import { Listing } from 'src/app/listing-card/listing-card.data';
import { Project } from '../projects.data';
import { ProjectDetailsService } from './project-details.service';

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})

export class ProjectDetailsComponent implements OnInit, OnDestroy {
    project: Project = {}
    coverImgUrl: string = ''

    listings: Listing[] = []

    sub: Subscription = new Subscription()

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectDetails: ProjectDetailsService,
        public login: LoginService,
        private injector: Injector,
        private dialog: MatDialog
    ) { }

    async ngOnInit() {
        this.sub.add(this.route.paramMap.subscribe(async (params: ParamMap) => {
            const projectId = params.get('projectId')
            if (!projectId) {
                return
            }

            this.project = await this.projectDetails.getProjectDetails(projectId)
            if (!this.project?.name) {
                this.router.navigateByUrl('/projects')
            }

            this.coverImgUrl = `url("${await this.projectDetails.getCoverImgUrl(this.project.coverImagePath!)}")`
        }))
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe()
    }

    async editProject() {
        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            disableClose: true,
            data: {
                isEditMode: true,
                project: this.project
            }
        } as MatDialogConfig;

        const { ProjectUploadModule } = await import("src/app/projects/project-upload/project-upload.module");
        const moduleRef = createNgModule(ProjectUploadModule, this.injector);
        const projectUploadComp = moduleRef.instance.getProjectUploadComponent();

        this.dialog.open(projectUploadComp, config);
    }

}