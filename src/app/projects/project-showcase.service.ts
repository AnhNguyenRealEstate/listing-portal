import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { FirestoreCollections } from '../shared/globals';
import { Project } from './projects.data';

@Injectable({ providedIn: 'root' })
export class ProjectShowcaseService {
    constructor(
        private firestore: Firestore
    ) { }

    async getProjectInfos(): Promise<Project[]> {
        const snap = await getDocs(collection(this.firestore, FirestoreCollections.projects))
        return snap.docs.map(doc => doc.data() as Project)
    }
}