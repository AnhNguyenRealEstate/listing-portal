import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Project } from 'src/app/projects/projects.data';
import { FirestoreCollections } from 'src/app/shared/globals';

@Injectable({ providedIn: 'root' })
export class LayoutService {
    constructor(
        private firestore: Firestore
    ) { }

    async getProjects(): Promise<Project[]> {
        const snap = await getDocs(collection(this.firestore, FirestoreCollections.projects))
        return snap.docs.map(doc => doc.data() as Project)
    }
}