import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AppDataService } from 'src/app/shared/app-data.service';
import { Listing } from '../listing-search/listing-search.data';

@Injectable({ providedIn: 'root' })
export class ListingUploadService {
    propertyTypes: string[] = [];
    locations: string[] = [];

    constructor(private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private appDataService: AppDataService) {

        this.appDataService.propertyTypes().subscribe(data => {
            this.propertyTypes = data;
        });
        this.appDataService.locations().subscribe(data => {
            this.locations = data;
        });
    }

    /* Uploads a new listing and create a new image storage path for related images */
    async publishListing(listing: Listing, imageFiles: File[]) {
        const date = new Date();
        const imageFolderName =
            `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
        const imageFolderPath = `listing-images/${imageFolderName}`;
        listing.imageFolderPath = imageFolderPath;

        await Promise.all(imageFiles.map(async (file, index) => {
            await this.storage.ref(`${imageFolderPath}/${index}`)
                .put(file)
                .catch(error => console.log(error));
        }));

        await this.firestore.collection('listings')
            .add(listing)
            .catch(error => console.log(error));

        this.updateAppData(this.locations, listing.location!, 'locations');
        this.updateAppData(this.propertyTypes, listing.propertyType!, 'property-types');
    }

    async updateAppData(currentList: string[], newEntry: string, attributeToUpdate: string) {
        if (currentList.indexOf(newEntry) == -1) {
            const newList = [...currentList];
            newList.push(newEntry);
            newList.sort((a, b) => a.localeCompare(b));

            await this.firestore.collection('app-data')
                .doc('listing-data')
                .update({ [attributeToUpdate]: newList });
        }
    }

    /* Save any editting on the listing and its image storage */
    async saveEdit(listing: Listing, imageFiles: File[], dbReferenceId: string) {
        const allImages = await this.storage.storage.ref(listing.imageFolderPath!).listAll();
        allImages.items.forEach(image => {
            image.delete();
        });

        for (let i = 0; i < imageFiles.length; i++) {
            this.storage.ref(`${listing.imageFolderPath}/${i}`)
                .put(imageFiles[i])
                .catch(error => console.log(error));
        }

        await this.firestore.collection("listings").doc(dbReferenceId).update(listing!);
    }

    async getListingImages(storagePath: string): Promise<string[]> {
        const allImages = await this.storage.storage.ref(storagePath).listAll();
        const result: string[] = [];
        for (let i = 0; i < allImages.items.length; i++) {
            const url = await allImages.items[i].getDownloadURL();
            result.push(url);
        }
        return result;
    }
}