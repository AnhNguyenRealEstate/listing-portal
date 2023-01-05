import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { FirestoreCollections } from '../shared/globals';
import { Project } from './project-card/project-card.data';

@Injectable({ providedIn: 'root' })
export class ProjectShowcaseService {
    constructor(
        private firestore: Firestore
    ) { }

    async getProjectInfos(): Promise<Project[]> {
        const snap = await getDocs(collection(this.firestore, FirestoreCollections.projects))
        return snap.docs.map(doc => doc.data() as Project)
    }

    generateMockProjects(): Project[] {
        const projects: Project[] = []
        for (let i = 0; i < 5; i++) {
            projects.push({
                id: i.toString(),
                name: `Project ${i}`,
                description: `A short, concise description of Project ${i}`
            })
        }

        return projects
    }
}