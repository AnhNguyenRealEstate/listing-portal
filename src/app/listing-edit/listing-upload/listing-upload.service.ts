import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, listAll, deleteObject, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { Listing, ListingImageFile } from '../../listing-search/listing-search.data';
import { FirebaseStorageConsts, FirestoreCollections } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { getMetadata } from '@firebase/storage';
import { Auth } from '@angular/fire/auth';
import { getAnalytics, logEvent } from '@angular/fire/analytics';


/**
 * TODO: transfer the upload logic to cloud functions
 * to ensure atomic writing
 */
@Injectable({ providedIn: 'any' })
export class ListingUploadService {

    private inProgress$$ = new BehaviorSubject<boolean>(false);
    private inProgress$ = this.inProgress$$.asObservable();

    watermarkImg: string = '';

    constructor(private firestore: Firestore,
        private storage: Storage,
        private auth: Auth
    ) {
    }

    /**
    Uploads a new listing and its images. Returns the Firestore ID of the listing.
    1. Store images 
    2. Add the new listing.
    
    Images must be stored first because in case of interruption, there won't be a null pointer 
    for fireStoragePath in the newly-created listing */
    //TODO: move to Cloud Functions for atomic publish
    async publishListing(listing: Listing, imageFiles: ListingImageFile[], coverImageFile: File): Promise<string> {
        function createStoragePath(listing: Listing) {
            const date = new Date();
            const imageFolderName =
                `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
            return `${FirebaseStorageConsts.listings}/${imageFolderName}`;
        }

        this.inProgress$$.next(true);

        this.sanitizeListing(listing);

        listing.createdBy = this.auth.currentUser?.email || '';

        const fireStoragePath = createStoragePath(listing);
        listing.fireStoragePath = fireStoragePath;
        listing.coverImagePath = `${fireStoragePath}/${FirebaseStorageConsts.coverImage}`;

        await this.storeCoverImage(coverImageFile, listing.coverImagePath);
        await this.storeListingImages(imageFiles, fireStoragePath);
        const docRef = await addDoc(collection(this.firestore, FirestoreCollections.listings), listing);

        logEvent(getAnalytics(), 'publish_listing', {
            id: docRef.id,
            category: listing.category,
            location: listing.location,
            author: listing.createdBy
        });

        this.inProgress$$.next(false);

        return docRef.id;
    }

    /**  Save any changes made to the listing and its images
    */
    //TODO: move to Cloud Functions for atomic publish
    async saveEdit(
        listing: Listing,
        dbReferenceId: string,
        imageFiles: ListingImageFile[],
        updateImages: boolean,
        coverImageFile: File,
        updateCoverImage: boolean) {

        this.inProgress$$.next(true);

        this.sanitizeListing(listing);

        if (updateImages) {
            /**
             * Overwrite db images with new images
             * If the length of imageFiles is shorter than the amount of files on db, remove the old/extra images
             * Update the listing's attributes
             */
            const imageFolderRef = ref(this.storage, `${listing.fireStoragePath!}/${FirebaseStorageConsts.listingImgsVideos}`);
            const numOfImagesOnStorage = (await listAll(imageFolderRef)).items.length;
            const numOfImagesUploaded = imageFiles.length;

            await this.storeListingImages(imageFiles, listing.fireStoragePath!);
            if (numOfImagesUploaded < numOfImagesOnStorage) {
                const imagesOnStorage = (await listAll(imageFolderRef)).items;
                imagesOnStorage.sort((a, b) => {
                    if (Number(a.name) > Number(b.name)) return 1;
                    if (Number(a.name) < Number(b.name)) return -1;
                    return 0;
                });

                await Promise.all(imagesOnStorage.map(async (img, index) => {
                    if (index + 1 > numOfImagesUploaded) {
                        await Promise.all(
                            [
                                deleteObject(ref(img))
                            ]
                        )
                    }
                }));
            }
        }

        if (updateCoverImage) {
            await this.storeCoverImage(coverImageFile, listing.coverImagePath!);
        }

        await updateDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbReferenceId}`), { ...listing });

        logEvent(getAnalytics(), 'edit_listing', {
            id: listing.id,
            category: listing.category,
            location: listing.location,
            media_updated: updateImages
        });

        this.inProgress$$.next(false);
    }

    async getListingCoverImage(coverImagePath: string): Promise<File> {
        async function getFile(url: string) {
            const response = await fetch(url);
            const data = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const metadata = {
                type: contentType
            };
            const fileExtension = contentType.split('/').pop() || '';
            return new File([data], `${FirebaseStorageConsts.coverImage}.${fileExtension}`, metadata);
        }

        const file = await getFile(
            await getDownloadURL(ref(this.storage, coverImagePath))
        );

        return file;
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

        const imageStoragePath = `${storagePath}/${FirebaseStorageConsts.listingImgsVideos}`;
        let allImages = (await listAll(ref(this.storage, imageStoragePath))).items;
        allImages.sort((a, b) => {
            if (Number(a.name) > Number(b.name)) return 1;
            if (Number(a.name) < Number(b.name)) return -1;
            return 0;
        });

        imageSrcs.push(...new Array<string>(allImages.length));
        imageFiles.push(...new Array<ListingImageFile>(allImages.length));

        // Storage Emulator isn't supporting the operations below
        await Promise.all(allImages.map(async (imageFile, index) => {

            const file = await getFile(
                await getDownloadURL(ref(imageFile)),
                index
            );
            const customMetadata = (await (getMetadata(imageFile))).customMetadata;
            const description = customMetadata ? customMetadata['description'] : undefined;

            imageFiles[index] = {
                file: file,
                description: description
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                imageSrcs[index] = reader.result as string;
            }
        }));
    }

    private async storeListingImages(imageFiles: ListingImageFile[], fireStoragePath: string) {
        if (!imageFiles.length) return;

        if (environment.test) return;

        await Promise.all(imageFiles.map(async (file, index) => {
            const imgsAndVideosPath = `${fireStoragePath}/${FirebaseStorageConsts.listingImgsVideos}/${index}`;
            await Promise.all([
                uploadBytes(
                    ref(
                        this.storage,
                        `${imgsAndVideosPath}`
                    ),
                    file.file,
                    { customMetadata: { description: file.description || '' } }
                ).catch()
            ]);
        }));
    }

    private async storeCoverImage(coverImageFile: File, coverImagePath: string) {
        if (environment.test) {
            return;
        }

        await uploadBytes(
            ref(
                this.storage,
                `${coverImagePath}`
            ),
            coverImageFile
        ).catch();
    }

    /**
     * 
     * @param listing the listing to be uploaded
     * 
     * NgModel always bind values as strings, this function corrects that behavior to prevent uploading
     * numeric values as strings to Firebase
     */
    private sanitizeListing(listing: Listing) {
        listing.bathrooms = Number(listing.bathrooms);
        listing.bedrooms = Number(listing.bedrooms);
        listing.price = Number(listing.price);
        listing.propertySize = Number(listing.propertySize);
    }

    /**
     * 
     * @returns An observable to keep track of uploading/saving progress
     */
    inProgress() {
        return this.inProgress$;
    }
}