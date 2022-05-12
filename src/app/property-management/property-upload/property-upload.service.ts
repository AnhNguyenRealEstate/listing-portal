import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { deleteObject, listAll, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { Property, UploadedFile } from '../property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyUploadService {
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
        property.documents = await this.storeFiles(uploadedFiles, property.fileStoragePath!);

        const docRef = await addDoc(collection(this.firestore, FirestoreCollections.underManagement), property);
        return docRef.id;
    }

    async editProperty(property: Property, newFiles: File[], deletedFiles: UploadedFile[]) {
        if (deletedFiles.length) {
            const fileStorageFolderRef = ref(this.storage, property.fileStoragePath!);
            const filesOnStorage = (await listAll(fileStorageFolderRef)).items;
            await Promise.all(filesOnStorage.map(async (fileOnStorage) => {
                if (deletedFiles.filter(fileToDelete => fileToDelete.dbHashedName === fileOnStorage.name).length) {
                    await deleteObject(ref(fileOnStorage));
                }
            }));
        }
        
        if (property.documents?.length) {
            property.documents!.push(...await this.storeFiles(newFiles, property.fileStoragePath!));
        } else {
            property.documents = [];
            property.documents.push(...await this.storeFiles(newFiles, property.fileStoragePath!));
        }

        await updateDoc(doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`), { ...property });
    }

    private async storeFiles(files: File[], folderPath: string): Promise<UploadedFile[]> {
        if (!files.length) return [];

        const uploadedFiles: UploadedFile[] = new Array(files.length);

        await Promise.all(files.map(async (file, index) => {
            const hashedName = this.generateHash(index.toString());
            const fileStoragePath = `${folderPath}/${hashedName}`;
            await Promise.all([
                uploadBytes(
                    ref(
                        this.storage,
                        `${fileStoragePath}`
                    ),
                    file
                ).catch()
            ]);
            uploadedFiles[index] = {
                dbHashedName: hashedName,
                displayName: file.name
            }
        }));

        return uploadedFiles;
    }

    private generateHash(str: string, seed?: number) {
        //https://www.codegrepper.com/code-examples/javascript/hash+a+string+angular
        /*jshint bitwise:false */
        let i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;
        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substring(-8);
    }
}