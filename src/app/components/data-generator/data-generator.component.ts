import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Listing } from '../listing-search/listing-search.data';
import { DataGeneratorService } from './data-generator.service';

@Component({
    selector: 'app-data-generator',
    templateUrl: 'data-generator.component.html'
})

export class DataGeneratorComponent {
    listingsToGenerate: number = 1;

    constructor(
        private generator: DataGeneratorService,
        private firestore: AngularFirestore,
        private storage: AngularFireStorage) { }

    generateData() {
        this.generator.generateListings(this.listingsToGenerate);
    }

    async deleteAll() {
        const firestoreRef = this.firestore.collection('listings');
        const dbResponse = await firestoreRef.get().toPromise().catch(error => console.log(error));

        if (!dbResponse) {
            return;
        }

        const docs = dbResponse.docs;
        for (let i = 0; i < docs.length; i++) {
            this.storage.ref((docs[i].data() as Listing).imageFolderPath!).delete();
            await firestoreRef.doc(docs[i].id).delete();
        }
    }
}