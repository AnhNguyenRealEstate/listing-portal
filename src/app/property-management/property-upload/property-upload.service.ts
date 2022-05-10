import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { Property, Document } from '../property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyUploadService {
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async uploadProperty(property: Property, uploadedFiles: File[]) {

    }

    async editProperty(property: Property, newFiles: File[], deletedFiles: Document[]) {

    }

    private async storeFiles(files: File[], folderPath: string) {

    }

    private async deleteFile(filePath: string) {

    }
}