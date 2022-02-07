import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, listAll, deleteObject, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { MetadataService } from 'src/app/shared/metadata.service';
import { Listing, ListingImageFile } from '../listing-search/listing-search.data';
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";
import { FirebaseStorageFolders, FirestoreCollections, FirestoreDocs, ImageFileVersion } from 'src/app/shared/globals';

@Injectable({ providedIn: 'root' })
export class ListingUploadService {
    private propertyTypes: string[] = [];
    private locations: string[] = [];

    constructor(private firestore: Firestore,
        private storage: Storage,
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
    Uploads a new listing and its images. Returns the Firestore ID of the listing.
    1. Store images 
    2. Add the new listing
    Images must be stored first because in case of interruption, there won't be a null pointer 
    for imageFolderPath in the newly-created listing */
    async publishListing(listing: Listing, imageFiles: ListingImageFile[]): Promise<string> {
        const imageFolderPath = this.createImageStoragePath(listing);
        listing.imageFolderPath = imageFolderPath;

        await this.storeListingImages(imageFiles, imageFolderPath);
        const docRef = await addDoc(collection(this.firestore, FirestoreCollections.listings), listing);
        await this.updateMetadata(this.locations, listing.location!, this.metadata.metadataKeys.locations);
        await this.updateMetadata(this.propertyTypes, listing.propertyType!, this.metadata.metadataKeys.propertyTypes);

        return docRef.id;
    }

    /**  Save any changes made to the listing and its images
    */
    async saveEdit(listing: Listing, dbReferenceId: string, imageFiles: ListingImageFile[], updateImages: boolean) {
        if (updateImages) {
            /**
             * Overwrite db images with new images
             * If the length of imageFiles is shorter than the amount of files on db, remove the old/extra images
             * Update the listing's attributes
             */
            const imageFolderRef = ref(this.storage, listing.imageFolderPath!);
            const numOfImagesOnStorage = (await listAll(imageFolderRef)).prefixes.length;
            const numOfImagesUploaded = imageFiles.length;

            await this.storeListingImages(imageFiles, listing.imageFolderPath!);
            if (numOfImagesUploaded < numOfImagesOnStorage) {
                const imagesOnStorage = (await listAll(imageFolderRef)).prefixes;
                await Promise.all(imagesOnStorage.map(async (img, index) => {
                    if (index + 1 > numOfImagesUploaded) {
                        await Promise.all(
                            [
                                deleteObject(ref(img, ImageFileVersion.compressed)),
                                deleteObject(ref(img, ImageFileVersion.raw))
                            ]
                        )
                    }
                }));
            }
        }

        await updateDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbReferenceId}`), { data: listing })

        await this.updateMetadata(this.locations, listing.location!, this.metadata.metadataKeys.locations);
        await this.updateMetadata(this.propertyTypes, listing.propertyType!, this.metadata.metadataKeys.propertyTypes);
    }

    /**
     * Get a listing's images from Firebase Storage
     */
    async getListingImages(storagePath: string, imageSrcs: string[], imageFiles: ListingImageFile[]): Promise<any> {

        async function getFile(url: string, index: number) {
            const response = await fetch(url);
            const data = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const metadata = {
                type: contentType
            };
            const fileExtension = contentType.split('/').pop() || '';
            return new File([data], `${index}.${fileExtension}`, metadata);
        }

        let allImages = (await listAll(ref(this.storage, storagePath))).prefixes;

        imageSrcs.push(...new Array<string>(allImages.length));
        imageFiles.push(...new Array<ListingImageFile>(allImages.length));

        await Promise.all(allImages.map(async (imageFile, index) => {
            let file_compressed = await getFile(
                await getDownloadURL(ref(imageFile, ImageFileVersion.compressed)),
                index
            );

            let file_raw = await getFile(
                await getDownloadURL(ref(imageFile, ImageFileVersion.raw)),
                index
            );
            imageFiles[index] = {
                compressed: file_compressed,
                raw: file_raw
            }

            const reader = new FileReader();
            reader.readAsDataURL(file_compressed);
            reader.onloadend = () => {
                imageSrcs[index] = reader.result as string;
            }
        }));
    }

    private async storeListingImages(imageFiles: ListingImageFile[], imageFolderPath: string) {
        if (!imageFiles.length) return;

        await Promise.all(imageFiles.map(async (file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = async () => {
                if (!file.compressed) {
                    const compressedImgAsBase64Url = await this.imageCompress.compressFile(reader.result as string, DOC_ORIENTATION.Up, 75);
                    const response = await fetch(compressedImgAsBase64Url);
                    const data = await response.blob();
                    file.compressed = new File([data], `${file.raw.name}_${ImageFileVersion.compressed}`, { type: file.raw.type });
                }

                await Promise.all([
                    uploadBytes(
                        ref(this.storage, `${imageFolderPath}/${index}/${ImageFileVersion.compressed}`), file.compressed
                    ).catch(() => { }),
                    uploadBytes(
                        ref(this.storage, `${imageFolderPath}/${index}/${ImageFileVersion.raw}`), file.raw
                    ).catch(() => { })
                ]);
            }
        }));
    }

    /**
     * Update metadata on Firestore. Metadata contains data that should be synced in real-time
     */
    private async updateMetadata(currentEntries: string[], newEntry: string, attributeToUpdate: string) {
        if (currentEntries.indexOf(newEntry) == -1) {
            const newList = [...currentEntries];
            newList.push(newEntry);
            newList.sort((a, b) => a.localeCompare(b));

            await updateDoc(
                doc(this.firestore, `${FirestoreCollections.metadata}/${FirestoreDocs.listingMetadata}`),
                attributeToUpdate,
                newList
            )
        }
    }

    private createImageStoragePath(listing: Listing) {
        const date = new Date();
        const imageFolderName =
            `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
        return `${FirebaseStorageFolders.listingImages}/${imageFolderName}`;
    }
}