import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AppDataService } from 'src/app/shared/app-data.service';
import { Listing } from '../listing-search/listing-search.data';
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";

@Injectable({ providedIn: 'root' })
export class ListingUploadService {
    private propertyTypes: string[] = [];
    private locations: string[] = [];

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

    /* Uploads a new listing and create a new image storage path for related images 
    1. Store images 
    2. Add the new listing
    Images must be stored first because in case of interruption, there won't be a null pointer 
    for imageFolderPath in the newly-created listing */
    async publishListing(listing: Listing, imageFiles: File[]) {
        const imageFolderPath = this.createImageStoragePath(listing);
        listing.imageFolderPath = imageFolderPath;

        await this.storeListingImages(imageFiles, imageFolderPath);

        const result = await this.firestore.collection('listings')
            .add(listing)
            .catch(error => console.log(error));

        this.updateAppData(this.locations, listing.location!, 'locations');
        this.updateAppData(this.propertyTypes, listing.propertyType!, 'property-types');

        return result;
    }

    /* Save any editting on the listing and its image storage 
        1. Create a new folder containing the listing's images
        2. Assign this new folder to the listing's imageFolderPath prop
        3. Delete the old folder
    */
    async saveEdit(listing: Listing, imageFiles: File[], dbReferenceId: string) {
        const oldFolderPath = listing.imageFolderPath!;
        const newFolderPath = this.createImageStoragePath(listing);
        await this.storeListingImages(imageFiles, newFolderPath);

        listing.imageFolderPath = newFolderPath;
        const result = await this.firestore.collection("listings").doc(dbReferenceId).update(listing!);

        await this.storage.storage.ref(oldFolderPath).delete();

        return result;
    }

    async getListingImages(storagePath: string, imageSrcs: string[], imageFiles: File[]): Promise<void> {
        const allImages = await this.storage.storage.ref(storagePath).listAll();

        await Promise.all(allImages.items.map(async (image, index) => {
            const url = await image.getDownloadURL();
            imageSrcs.push(url);

            const response = await fetch(url);
            const data = await response.blob();
            const metadata = {
                type: 'image/jpeg'
            };
            let file = new File([data], `${index}.jpg`, metadata);
            imageFiles.push(file)
        }));
    }

    private async storeListingImages(imageFiles: File[], imageFolderPath: string) {
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

    private async updateAppData(currentList: string[], newEntry: string, attributeToUpdate: string) {
        if (currentList.indexOf(newEntry) == -1) {
            const newList = [...currentList];
            newList.push(newEntry);
            newList.sort((a, b) => a.localeCompare(b));

            await this.firestore.collection('app-data')
                .doc('listing-data')
                .update({ [attributeToUpdate]: newList });
        }
    }

    private createImageStoragePath(listing: Listing) {
        const date = new Date();
        const imageFolderName =
            `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
        return `listing-images/${imageFolderName}`;
    }

    private async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
        const res: Response = await fetch(dataUrl);
        const blob: Blob = await res.blob();
        return new File([blob], fileName, { type: 'image/png' });
    }
}