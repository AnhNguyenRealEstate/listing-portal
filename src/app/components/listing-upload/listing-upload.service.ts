import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MetadataService } from 'src/app/shared/app-data.service';
import { Listing } from '../listing-search/listing-search.data';
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";
import { FirestoreCollections, FirestoreDocs } from 'src/app/shared/globals';

@Injectable({ providedIn: 'root' })
export class ListingUploadService {
    private propertyTypes: string[] = [];
    private locations: string[] = [];

    constructor(private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private metadata: MetadataService,
        private imageCompress: NgxImageCompressService
    ) {
        this.metadata.propertyTypes().subscribe(data => {
            this.propertyTypes = data;
        });
        this.metadata.locations().subscribe(data => {
            this.locations = data;
        });
    }

    /**
    Uploads a new listing and its images
    1. Store images 
    2. Add the new listing
    Images must be stored first because in case of interruption, there won't be a null pointer 
    for imageFolderPath in the newly-created listing */
    async publishListing(listing: Listing, imageFiles: File[]) {
        const imageFolderPath = this.createImageStoragePath(listing);
        listing.imageFolderPath = imageFolderPath;

        await this.storeListingImages(imageFiles, imageFolderPath);
        await this.firestore.collection(FirestoreCollections.listings)
            .add(listing)
            .catch(error => console.log(error));
        await this.updateAppData(this.locations, listing.location!, this.metadata.metadataKeys.locations);
        await this.updateAppData(this.propertyTypes, listing.propertyType!, this.metadata.metadataKeys.propertyTypes);
    }

    /**  Save any changes made to the listing and its images
    */
    async saveEdit(listing: Listing, dbReferenceId: string, imageFiles: File[], updateImages: boolean) {
        /**
         * Overwrite db images with new images
         * If the length of imageFiles is shorter than the amount of files on db, remove the old and extra images
         * Update the listing's attributes
         */

        if (updateImages) {
            const imageFolderRef = this.storage.storage.ref(listing.imageFolderPath!);
            const numOfImagesOnStorage = (await imageFolderRef.listAll()).items.length;
            const numOfImagesUploaded_AdjustedForRawAndCompressed = imageFiles.length * 2;

            await this.storeListingImages(imageFiles, listing.imageFolderPath!);
            if (numOfImagesUploaded_AdjustedForRawAndCompressed < numOfImagesOnStorage) {
                const imagesOnStorage = (await imageFolderRef.listAll()).items;
                await Promise.all(imagesOnStorage.map(async (img, index) => {
                    if (index + 1 > numOfImagesUploaded_AdjustedForRawAndCompressed) {
                        await img.delete();
                    }
                }));
            }
        }

        await this.firestore.collection(FirestoreCollections.listings).doc(dbReferenceId).update(listing!);

        await this.updateAppData(this.locations, listing.location!, this.metadata.metadataKeys.locations);
        await this.updateAppData(this.propertyTypes, listing.propertyType!, this.metadata.metadataKeys.propertyTypes);
    }

    /**
     * Get a listing's images from Firebase Storage
     * @param storagePath Firebase Storage path of the listing's images
     * @param imageSrcs Array to store the images' urls
     * @param imageFiles Array to store the actual image data
     */
    async getListingImages(storagePath: string, imageSrcs: string[], imageFiles: File[]): Promise<any> {
        const allImages = await this.storage.storage.ref(storagePath).listAll();

        imageSrcs.push(...new Array<string>(allImages.items.length));
        imageFiles.push(...new Array<File>(allImages.items.length));

        await Promise.all(allImages.items.map(async (image, index) => {
            const url = await image.getDownloadURL();
            const response = await fetch(url);
            const data = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const metadata = {
                type: contentType
            };
            const fileExtension = contentType.split('/').pop() || '';
            const file = new File([data], `${index}.${fileExtension}`, metadata);
            imageFiles[index] = file;

            const reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = () => {
                imageSrcs[index] = reader.result as string;
            }
        }));
    }

    private async storeListingImages(imageFiles: File[], imageFolderPath: string) {
        if (!imageFiles.length) return;

        await Promise.all(imageFiles.map(async (file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const compressedImgAsBase64Url = await this.imageCompress.compressFile(reader.result as string, DOC_ORIENTATION.Up);
                const response = await fetch(compressedImgAsBase64Url);
                const data = await response.blob();
                const compressedImg = new File([data], file.name, { type: file.type });

                await Promise.all([
                    this.storage.ref(`${imageFolderPath}/${index}_compressed`)
                        .put(compressedImg)
                        .catch(error => console.log(error)),
                    this.storage.ref(`${imageFolderPath}/${index}_raw`)
                        .put(file)
                        .catch(error => console.log(error))
                ]);
            }
        }));
    }

    /**
     * Update app-data on Firestore. "app-data" contains data that should be synced in real-time
     * @param currentEntries A list of items from a specific attribute in app-data
     * @param newEntry A new entry that may or may not exist in said list
     * @param attributeToUpdate Name of said attribute. Ex: 'locations'
     */
    private async updateAppData(currentEntries: string[], newEntry: string, attributeToUpdate: string) {
        if (currentEntries.indexOf(newEntry) == -1) {
            const newList = [...currentEntries];
            newList.push(newEntry);
            newList.sort((a, b) => a.localeCompare(b));

            await this.firestore.collection(FirestoreCollections.metadata)
                .doc(FirestoreDocs.listingMetadata)
                .update({ [attributeToUpdate]: newList });
        }
    }

    private createImageStoragePath(listing: Listing) {
        const date = new Date();
        const imageFolderName =
            `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
        return `listing-images/${imageFolderName}`;
    }
}