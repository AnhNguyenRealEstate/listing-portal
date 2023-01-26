import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, Renderer2 } from '@angular/core';
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

    currentProjectIdx: number = 0

    private scrollDistanceX = window.innerWidth / 3; // one third screen width
    private touchStartX: number = 0
    private touchEndX: number = 0

    constructor(
        private projectShowcase: ProjectShowcaseService,
        private storage: Storage,
        private renderer: Renderer2,
        private router: Router
    ) { }

    async ngOnInit() {
        this.projects = await this.projectShowcase.getProjectInfos()

        for (let i = 0; i < this.projects.length; i++) {
            this.projectCoverImgUrls.set(
                this.projects[i].id!
                , await this.getCoverPhotoUrl(this.projects[i].coverImagePath!))
        }

        document.querySelectorAll('.project-info-wrapper').forEach((el, index) => {
            if (index === 0) {
                (el as HTMLElement).dataset['status'] = 'active'
            } else {
                (el as HTMLElement).dataset['status'] = 'inactive-right'
            }
        })
    }

    @HostListener('touchstart', ['$event']) onTouchStart(e: TouchEvent) {
        this.touchStartX = e.changedTouches[0].screenX
    }

    @HostListener('touchend', ['$event']) onTouchEnd(e: TouchEvent) {
        this.touchEndX = e.changedTouches[0].screenX

        if (!(Math.abs(this.touchStartX - this.touchEndX) > this.scrollDistanceX)) {
            return
        }

        if (this.touchEndX < this.touchStartX && this.currentProjectIdx < this.projects.length - 1) {
            this.scrollRight()
        } else if (this.touchEndX > this.touchStartX && this.currentProjectIdx > 0) {
            this.scrollLeft()
        }
    }

    async getCoverPhotoUrl(coverImgPath: string) {
        const url = await getDownloadURL(ref(this.storage, coverImgPath))
        return `url("${url}")`
    }

    viewProjectDetails(id: string) {
        this.router.navigateByUrl(`/projects/details/${id}`)
    }

    scrollLeft() {
        if (this.currentProjectIdx === 0) {
            return;
        }

        const current = document.querySelector('.project-info-wrapper[data-status="active"]') as HTMLElement
        current.dataset['status'] = "inactive-right"

        const allInactiveLefts = document.querySelectorAll('.project-info-wrapper[data-status="inactive-left"]')
        setTimeout(() => {
            const next = allInactiveLefts.item(allInactiveLefts.length - 1) as HTMLElement
            next.dataset['status'] = "active"
        }, 100)

        setTimeout(() => {
            const translateOffset = `-${(allInactiveLefts.length - 1) * 60}vw`
            const projectsContainer = document.querySelector('.all-projects') as HTMLElement
            this.renderer.setStyle(projectsContainer, 'transform', `translateX(${translateOffset})`)

        }, 250)

        this.currentProjectIdx -= 1
    }

    scrollRight() {
        if (this.currentProjectIdx === this.projects.length - 1) {
            return;
        }

        const translateOffset = `-${(this.currentProjectIdx + 1) * 60}vw`
        const projectsContainer = document.querySelector('.all-projects') as HTMLElement
        this.renderer.setStyle(projectsContainer, 'transform', `translateX(${translateOffset})`)

        const current = document.querySelector('.project-info-wrapper[data-status="active"]') as HTMLElement
        current.dataset['status'] = "inactive-left"

        const next = document.querySelector('.project-info-wrapper[data-status="inactive-right"]') as HTMLElement
        next.dataset['status'] = "active"

        this.currentProjectIdx += 1
    }
}