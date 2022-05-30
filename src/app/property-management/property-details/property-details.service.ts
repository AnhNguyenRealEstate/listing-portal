import { Injectable } from '@angular/core';
import { getBlob, ref, Storage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class PropertyDetailsService {
    constructor(
        private storage: Storage
    ) { }

    async getDoc(docPath: string): Promise<Blob> {
        return await getBlob(ref(this.storage, `${docPath}`));
    }
}