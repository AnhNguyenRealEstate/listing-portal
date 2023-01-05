import { Injectable } from '@angular/core';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { Project } from '../project-card/project-card.data';

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
    async publishProject(project: Project, imageFiles: File[], coverImageFile: File): Promise<string> {
        function createStoragePath(project: Project) {
            const date = new Date();
            const imageFolderName =
                `${project.name}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
            return `${FirebaseStorageConsts.projects}/${imageFolderName}`;
        }

        this.inProgress$$.next(true);

        project.createdBy = this.auth.currentUser?.email || '';

        const fireStoragePath = createStoragePath(project);
        project.fireStoragePath = fireStoragePath;
        project.coverImagePath = `${fireStoragePath}/${FirebaseStorageConsts.coverImage}`;

        await this.storeCoverImage(coverImageFile, project.coverImagePath);
        await this.storeListingImages(imageFiles, fireStoragePath);
        const docRef = await addDoc(collection(this.firestore, FirestoreCollections.projects), project);

        logEvent(getAnalytics(), 'publish_project', {
            id: docRef.id,
            name: project.name,
            author: project.createdBy
        });

        this.inProgress$$.next(false);

        return docRef.id;
    }

    /**  Save any changes made to the listing and its images
    */
    async saveEdit(
        project: Project,
        dbReferenceId: string,
        imageFiles: File[],
        updateImages: boolean,
        coverImageFile: File,
        updateCoverImage: boolean) {

        this.inProgress$$.next(true);

        if (updateImages) {
            /**
             * Overwrite db images with new images
             * If the length of imageFiles is shorter than the amount of files on db, remove the old/extra images
             * Update the listing's attributes
             */
            const imageFolderRef = ref(this.storage, `${project.fireStoragePath!}/${FirebaseStorageConsts.listingImgsVideos}`);
            const numOfImagesOnStorage = (await listAll(imageFolderRef)).items.length;
            const numOfImagesUploaded = imageFiles.length;

            await this.storeListingImages(imageFiles, project.fireStoragePath!);
            if (numOfImagesUploaded < numOfImagesOnStorage) {
                const imagesOnStorage = (await listAll(imageFolderRef)).items;
                imagesOnStorage.sort((a, b) => {
                    if (Number(a.name) > Number(b.name)) return 1;
                    if (Number(a.name) < Number(b.name)) return -1;
                    return 0;
                });

                await Promise.all(imagesOnStorage.map(async (img, index) => {
                    if (index + 1 > numOfImagesUploaded) {
                        await Promise.all(
                            [
                                deleteObject(ref(img))
                            ]
                        )
                    }
                }));
            }
        }

        if (updateCoverImage) {
            await this.storeCoverImage(coverImageFile, project.coverImagePath!);
        }

        await updateDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbReferenceId}`), { ...project });

        logEvent(getAnalytics(), 'edit_project', {
            id: project.id,
            name: project.name,
            media_updated: updateImages
        });

        this.inProgress$$.next(false);
    }

    private async storeListingImages(imageFiles: File[], fireStoragePath: string) {
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