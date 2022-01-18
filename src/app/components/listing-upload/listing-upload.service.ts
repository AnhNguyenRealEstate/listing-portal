import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AppDataService } from 'src/app/shared/app-data.service';
import { Listing } from '../listing-search/listing-search.data';
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";

@Injectable({ providedIn: 'root' })
export class ListingUploadService {
    propertyTypes: string[] = [];
    locations: string[] = [];

    constructor(private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private appDataService: AppDataService,
        private imageCompress: NgxImageCompressService
    ) {
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

        await this.storeListingImages(imageFiles, imageFolderPath);

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
        const imageFolderPath = listing.imageFolderPath!;
        const allImages = await this.storage.storage.ref(imageFolderPath).listAll();

        await Promise.all(allImages.items.map(async (image) => {
            await image.delete();
        }))

        await this.storeListingImages(imageFiles, imageFolderPath);

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

    async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
        const res: Response = await fetch(dataUrl);
        const blob: Blob = await res.blob();
        return new File([blob], fileName, { type: 'image/png' });
    }

    async storeListingImages(imageFiles: File[], imageFolderPath: string) {
        await Promise.all(imageFiles.map(async (file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                if (reader.result) {
                    const compressedImgAsBase64 = await this.imageCompress.compressFile(reader.result as string, DOC_ORIENTATION.Up);
                    const compressedImg = await this.dataUrlToFile(compressedImgAsBase64, file.name);
                    await this.storage.ref(`${imageFolderPath}/${index}`)
                        .put(compressedImg)
                        .catch(error => console.log(error));
                }
            }
        }));
    }
}