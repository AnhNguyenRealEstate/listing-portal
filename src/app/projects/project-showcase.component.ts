import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Project } from './projects.data';
import { ProjectShowcaseService } from './project-showcase.service';

@Component({
    selector: 'project-showcase',
    templateUrl: './project-showcase.component.html',
    styleUrls: ['./project-showcase.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})

export class ProjectShowcaseComponent implements OnInit {

    projects: Project[] = []
    projectCoverImgUrls: Map<string, string> = new Map()
    projectCoverImg: Map<string, string> = new Map

    currentProject: Project = {}
    currentProjectIdx: number = 0
    currentProjectCoverImgUrl: string = ''

    constructor(
        private projectShowcase: ProjectShowcaseService,
        private storage: Storage,
        private router: Router,
        private changeDetector: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.projects = await this.projectShowcase.getProjectInfos()
        //this.projects = this.projectShowcase.generateMockProjects()

        for (let i = 0; i < this.projects.length; i++) {
            this.projectCoverImgUrls.set(
                this.projects[i].id!
                , await this.getCoverPhotoUrl(this.projects[i].coverImagePath!))
        }

        if (this.projects.length)
            this.setCurrentProject(this.projects[0])
    }

    viewProject(id: string) {
        this.setCurrentProject(this.projects.find(project => project.id === id)!)
    }

    setCurrentProject(project: Project) {
        this.currentProject = project

        getDownloadURL(ref(this.storage, this.currentProject.coverImagePath)).then(url => {
            this.currentProjectCoverImgUrl = `url("${url}")`
        })

        // this.currentProjectCoverImgUrl = `url("https://picsum.photos/1920/1080")`
    }

    async getCoverPhotoUrl(coverImgPath: string) {
        const url = await getDownloadURL(ref(this.storage, coverImgPath))
        //const url = 'https://picsum.photos/1920/1080'
        return `url("${url}")`
    }

    viewProjectDetails(id: string) {
        this.router.navigateByUrl(`/projects/details/${id}`)
    }

    scrollLeft() {
        if (this.currentProjectIdx === 0) {
            return;
        }

        this.setCurrentProject(this.projects[this.currentProjectIdx - 1])
        this.currentProjectIdx -= 1
        this.changeDetector.detectChanges()
    }

    scrollRight() {
        if (this.currentProjectIdx === this.projects.length - 1) {
            return;
        }

        this.setCurrentProject(this.projects[this.currentProjectIdx + 1])
        this.currentProjectIdx += 1
        this.changeDetector.detectChanges()

    }
}