import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, listAll, deleteObject, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { MetadataService } from 'src/app/shared/metadata.service';
import { Listing, ListingImageFile } from '../../listing-search/listing-search.data';
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";
import { FirebaseStorageFolders, FirestoreCollections, FirestoreDocs, ImageFileVersion } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class ListingUploadService {
    private locations: string[] = [];

    private inProgress$$ = new BehaviorSubject<boolean>(false);
    private inProgress$ = this.inProgress$$.asObservable();

    constructor(private firestore: Firestore,
        private storage: Storage,
        private metadata: MetadataService,
        private imageCompress: NgxImageCompressService
    ) {
        this.metadata.locations().subscribe(data => {
            this.locations = data;
        });
    }

    /**
    Uploads a new listing and its images. Returns the Firestore ID of the listing.
    1. Store images 
    2. Add the new listing.
    
    Images must be stored first because in case of interruption, there won't be a null pointer 
    for fireStoragePath in the newly-created listing */
    async publishListing(listing: Listing, imageFiles: ListingImageFile[]): Promise<string> {
        function createStoragePath(listing: Listing) {
            const date = new Date();
            const imageFolderName =
                `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
            return `${FirebaseStorageFolders.listings}/${imageFolderName}`;
        }

        this.inProgress$$.next(true);

        const fireStoragePath = createStoragePath(listing);
        listing.fireStoragePath = fireStoragePath;

        await this.storeListingImages(imageFiles, fireStoragePath);
        const docRef = await addDoc(collection(this.firestore, FirestoreCollections.listings), listing);
        await this.updateMetadata(this.locations, listing.location!, this.metadata.metadataKeys.locations);

        this.inProgress$$.next(false);

        return docRef.id;
    }

    /**  Save any changes made to the listing and its images
    */
    async saveEdit(listing: Listing, dbReferenceId: string, imageFiles: ListingImageFile[], updateImages: boolean) {
        this.inProgress$$.next(true);

        if (updateImages) {
            /**
             * Overwrite db images with new images
             * If the length of imageFiles is shorter than the amount of files on db, remove the old/extra images
             * Update the listing's attributes
             */
            const imageFolderRef = ref(this.storage, `${listing.fireStoragePath!}/${FirebaseStorageFolders.listingImgsVideos}`);
            const numOfImagesOnStorage = (await listAll(imageFolderRef)).prefixes.length;
            const numOfImagesUploaded = imageFiles.length;

            await this.storeListingImages(imageFiles, listing.fireStoragePath!);
            if (numOfImagesUploaded < numOfImagesOnStorage) {
                const imagesOnStorage = (await listAll(imageFolderRef)).prefixes;
                imagesOnStorage.sort((a, b) => {
                    if (Number(a.name) > Number(b.name)) return 1;
                    if (Number(a.name) < Number(b.name)) return -1;
                    return 0;
                });

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

        await updateDoc(doc(this.firestore, `${FirestoreCollections.listings}/${dbReferenceId}`), { ...listing });

        await this.updateMetadata(this.locations, listing.location!, this.metadata.metadataKeys.locations);

        this.inProgress$$.next(false);
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

        function getMockFiles(imageFiles: ListingImageFile[], imageSrcs: string[]) {
            for (let i = 0; i < imageFiles.length; i++) {
                const blob = new Blob();
                const file = new File([blob], `${i}.jpg`, { type: blob.type })
                imageFiles[i] = ({ compressed: file, raw: file } as ListingImageFile);

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    imageSrcs[i] = reader.result as string;
                }
            }
        }

        const imageStoragePath = `${storagePath}/${FirebaseStorageFolders.listingImgsVideos}`;
        let allImages = (await listAll(ref(this.storage, imageStoragePath))).prefixes;
        allImages.sort((a, b) => {
            if (Number(a.name) > Number(b.name)) return 1;
            if (Number(a.name) < Number(b.name)) return -1;
            return 0;
        });

        imageSrcs.push(...new Array<string>(allImages.length));
        imageFiles.push(...new Array<ListingImageFile>(allImages.length));

        if (!environment.production) {
            getMockFiles(imageFiles, imageSrcs);
            return;
        }

        // Storage Emulator isn't supporting the operations below
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

    private async storeListingImages(imageFiles: ListingImageFile[], fireStoragePath: string) {
        if (!imageFiles.length) return;

        await Promise.all(imageFiles.map(async (file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = async () => {
                if (!file.compressed) {
                    const compressedImgAsBase64Url =
                        await this.imageCompress.compressFile(
                            reader.result as string, DOC_ORIENTATION.Default,
                            100, 75, 1920, 1080);
                    const response = await fetch(compressedImgAsBase64Url);
                    const data = await response.blob();
                    file.compressed = new File(
                        [data],
                        `${file.raw.name}_${ImageFileVersion.compressed}`,
                        { type: file.raw.type }
                    );
                }

                if (environment.test) {
                    return;
                }

                const imgsAndVideosPath = `${fireStoragePath}/${FirebaseStorageFolders.listingImgsVideos}/${index}`;
                await Promise.all([
                    uploadBytes(
                        ref(
                            this.storage,
                            `${imgsAndVideosPath}/${ImageFileVersion.compressed}`
                        ),
                        file.compressed
                    ).catch(),
                    uploadBytes(
                        ref(
                            this.storage,
                            `${imgsAndVideosPath}/${ImageFileVersion.raw}`
                        ),
                        file.raw
                    ).catch()
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

    /**
     * 
     * @returns An observable to keep track of uploading/saving progress
     */
    inProgress() {
        return this.inProgress$;
    }
}