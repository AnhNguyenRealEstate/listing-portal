import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentSnapshot, Firestore, getDocs, limit, orderBy, query, startAfter, updateDoc } from '@angular/fire/firestore';
import { deleteObject, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { Activity, Property, UploadedFile } from '../property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyUploadService {
    public initialNumOfActivities = 10;
    
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async uploadProperty(property: Property, uploadedFiles: File[]): Promise<string> {
        function createFileStoragePath(property: Property) {
            const date = new Date();
            const folderName =
                `${property.name?.substring(0, 5)}-${property.category}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
            return `${FirebaseStorageConsts.underManagement}/${folderName}`;
        }

        property.fileStoragePath = createFileStoragePath(property);
        property.documents = await this.storeFiles(uploadedFiles, property);

        const docRef = await addDoc(collection(this.firestore, FirestoreCollections.underManagement), property);
        return docRef.id;
    }

    async editProperty(property: Property, newFiles: File[], deletedFiles: UploadedFile[], deletedActivities: Activity[]) {
        if (deletedFiles.length) {
            deletedFiles.map((fileToDelete) => {
                deleteObject(ref(this.storage, `${property.fileStoragePath}/${fileToDelete.dbHashedName}`));
            });
        }

        if (deletedActivities.length) {
            deletedActivities.map(activity => {
                if (!activity.documents?.length) {
                    return;
                }

                this.removeActivity(property, activity);
            });
        }

        if (property.documents?.length) {
            property.documents!.push(...await this.storeFiles(newFiles, property));
        } else {
            property.documents = [];
            property.documents.push(...await this.storeFiles(newFiles, property));
        }

        await updateDoc(doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`), { ...property });
    }

    private async storeFiles(files: File[], property: Property): Promise<UploadedFile[]> {
        if (!files.length) return [];

        const uploadedFiles: UploadedFile[] = new Array(files.length);

        await Promise.all(files.map(async (file, index) => {
            const hashedName = property.documents!.find(document => document.displayName === file.name)?.dbHashedName;
            if (!hashedName) {
                return;
            }

            const fileStoragePath = `${property.fileStoragePath}/${hashedName}`;
            await uploadBytes(
                ref(
                    this.storage,
                    `${fileStoragePath}`
                ),
                file
            ).catch();

            uploadedFiles[index] = {
                dbHashedName: hashedName,
                displayName: file.name
            }
        }));

        return uploadedFiles;
    }

    async getActivities(property: Property) {
        const snapshot = await getDocs(
            query(
                collection(
                    doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`),
                    'activities'
                ),
                orderBy('date', 'desc'),
                limit(this.initialNumOfActivities)
            )
        );
        return snapshot;
    }

    async getMoreActivities(property: Property, lastResult: DocumentSnapshot) {
        const snapshot = await getDocs(
            query(
                collection(
                    doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`),
                    'activities'
                ),
                orderBy('date', 'desc'),
                startAfter(lastResult),
                limit(this.initialNumOfActivities)
            )
        );

        return snapshot;
    }

    async removeActivity(property: Property, activityToRemove: Activity) {
        if (!activityToRemove.documents?.length) {
            return;
        }

        await Promise.all(activityToRemove.documents?.map(async docToRemove => {
            const fileStoragePath = `${property.fileStoragePath}/${docToRemove.dbHashedName}`;
            await deleteObject(
                ref(
                    this.storage,
                    `${fileStoragePath}`
                )
            ).catch();
        }));

        await deleteDoc(
            doc(
                collection(
                    doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`),
                    'activities'
                ),
                activityToRemove.id
            )
        );
    }
}