import { Injectable } from '@angular/core';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Project } from '../projects.data';

@Injectable({ providedIn: 'root' })
export class ProjectUploadService {
    private inProgress$$ = new BehaviorSubject<boolean>(false);
    private inProgress$ = this.inProgress$$.asObservable();

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private auth: Auth
    ) { }


    /**
    Uploads a new listing and its images. Returns the Firestore ID of the listing.
    1. Store images 
    2. Add the new listing.
    
    Images must be stored first because in case of interruption, there won't be a null pointer 
    for fireStoragePath in the newly-created listing */
    async publishProject(project: Project, imageFiles: File[], coverImageFile: File): Promise<void> {
        function createStoragePath(project: Project) {
            const date = new Date();
            const imageFolderName =
                `${project.id}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
            return `${FirebaseStorageConsts.projects}/${imageFolderName}`;
        }

        function createId(projectName: string): string {

            //https://int3ractive.com/blog/2019/hai-ung-dung-cua-string-normalize-voi-tieng-viet/

            let str = projectName
            str = str.toLowerCase()
            str = str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            str = str.replace(/[đĐ]/g, 'd');
            str = str.replace(/([^0-9a-z-\s])/g, '');
            str = str.replace(/(\s+)/g, '-');
            str = str.replace(/-+/g, '-');
            str = str.replace(/^-+|-+$/g, '');
            return str;
        }

        this.inProgress$$.next(true);

        project.createdBy = this.auth.currentUser?.email || '';
        project.id = createId(project.name!)

        const fireStoragePath = createStoragePath(project);
        project.fireStoragePath = fireStoragePath;
        project.coverImagePath = `${fireStoragePath}/${FirebaseStorageConsts.coverImage}`;

        await this.storeCoverImage(coverImageFile, project.coverImagePath);
        //await this.storeProjectImages(imageFiles, fireStoragePath);
        await setDoc(
            doc(this.firestore, `${FirestoreCollections.projects}/${project.id}`),
            project
        );

        logEvent(getAnalytics(), 'publish_project', {
            name: project.name,
            author: project.createdBy
        });

        this.inProgress$$.next(false);
    }

    async saveEdit(
        project: Project,
        dbReferenceId: string,
        coverImageFile: File,
        updateCoverImage: boolean) {

        this.inProgress$$.next(true);

        if (updateCoverImage) {
            await uploadBytes(
                ref(
                    this.storage,
                    `${project.coverImagePath}`
                ),
                coverImageFile
            )
        }

        await updateDoc(doc(this.firestore, `${FirestoreCollections.projects}/${dbReferenceId}`), { ...project });

        logEvent(getAnalytics(), 'edit_project', {
            id: project.id
        });

        this.inProgress$$.next(false);
    }

    private async storeProjectImages(imageFiles: File[], fireStoragePath: string) {
        if (!imageFiles.length) return;

        if (environment.test) return;

        await Promise.all(imageFiles.map(async (file, index) => {
            const imgsAndVideosPath = `${fireStoragePath}/${FirebaseStorageConsts.listingImgsVideos}/${index}`;
            await Promise.all([
                uploadBytes(
                    ref(
                        this.storage,
                        `${imgsAndVideosPath}`
                    ),
                    file
                ).catch()
            ]);
        }));
    }

    private async storeCoverImage(coverImageFile: File, coverImagePath: string) {
        if (environment.test) {
            return;
        }

        await uploadBytes(
            ref(
                this.storage,
                `${coverImagePath}`
            ),
            coverImageFile
        ).catch();
    }

    /**
     * 
     * @returns An observable to keep track of uploading/saving progress
     */
    inProgress() {
        return this.inProgress$;
    }

}