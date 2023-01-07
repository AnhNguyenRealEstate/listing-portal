import { Injectable } from '@angular/core';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { collection, doc, Firestore, getDoc, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { Listing } from 'src/app/listing-card/listing-card.data';
import { FirestoreCollections } from 'src/app/shared/globals';
import { Project } from '../projects.data';

@Injectable({ providedIn: 'root' })
export class ProjectDetailsService {
    constructor(private firestore: Firestore, private storage: Storage) { }

    async getProjectDetails(id: string): Promise<Project> {
        const snap = await getDoc(doc(this.firestore, `${FirestoreCollections.projects}/${id}`))
        return snap.data() as Project
    }

    async getCoverImgUrl(path: string) {
        return await getDownloadURL(ref(this.storage, path))
    }

    async getListingsFromProject(projectId: string): Promise<Listing[]> {
        if (!projectId) {
            return []
        }
        
        const snap = await getDocs(
            query(
                collection(this.firestore, `${FirestoreCollections.listings}`),
                where('projectId', '==', projectId),
                orderBy('creationDate', 'desc')
            )
        )

        return snap.docs.map(doc => doc.data() as Listing)
    }
}