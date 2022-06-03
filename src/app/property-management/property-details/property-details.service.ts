import { Injectable } from '@angular/core';
import { updateDoc, doc, Firestore } from '@angular/fire/firestore';
import { deleteObject, getBlob, ref, Storage } from '@angular/fire/storage';
import { FirestoreCollections } from 'src/app/shared/globals';
import { Property, Activity } from '../property-management.data';

@Injectable({ providedIn: 'root' })
export class PropertyDetailsService {
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    async downloadDoc(docPath: string): Promise<Blob> {
        return await getBlob(ref(this.storage, `${docPath}`));
    }

    async removeActivity(property: Property, activityToRemove: Activity) {
        //TODO: create a subcollection of activities with their own ids
        property.activities = property.activities!.filter(
            activity => (activity.date as any).seconds !== (activityToRemove as any).seconds
        );

        await Promise.all(
            [
                updateDoc(doc(this.firestore, `${FirestoreCollections.underManagement}/${property.id}`), { ...property }),
                () => {
                    return activityToRemove.documents?.map(async docToRemove => {
                        const fileStoragePath = `${property.fileStoragePath}/${docToRemove.dbHashedName}`;
                        await deleteObject(
                            ref(
                                this.storage,
                                `${fileStoragePath}`
                            )
                        ).catch()
                    });
                }
            ]
        );
    }
}