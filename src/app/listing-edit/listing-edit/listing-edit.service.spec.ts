import { TestBed } from "@angular/core/testing";
import { collection, connectFirestoreEmulator, doc, Firestore, getDoc, getDocs, getFirestore, provideFirestore } from "@angular/fire/firestore";
import { connectStorageEmulator, FirebaseStorage, getStorage, provideStorage } from "@angular/fire/storage";
import { MetadataService } from "src/app/shared/metadata.service";
import { NgxImageCompressService } from "ngx-image-compress";
import { firebaseConfig, FirestoreCollections } from "src/app/shared/globals";
import { ListingEditService } from "./listing-edit.service";
import { FirebaseApp, initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { Auth, connectAuthEmulator, getAuth, provideAuth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { Listing, ListingImageFile } from "../../components/listing-search/listing-search.data";
import { ListingUploadService } from "../listing-upload/listing-upload.service";


describe('Listing Upload Service', () => {
    let firebaseApp: FirebaseApp;
    let firestore: Firestore;
    let storage: FirebaseStorage;
    let auth: Auth;

    let listingUpload: ListingUploadService;
    let listingEdit: ListingEditService;
    let metadata: MetadataService;
    let imgCompress: NgxImageCompressService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                provideFirebaseApp(() => {
                    firebaseApp = initializeApp(firebaseConfig);
                    return firebaseApp;
                }),
                provideFirestore(() => {
                    firestore = getFirestore();
                    connectFirestoreEmulator(firestore, 'localhost', 8080);
                    return firestore;
                }),
                provideStorage(() => {
                    storage = getStorage();
                    connectStorageEmulator(storage, 'localhost', 9199);
                    return storage;
                }),
                provideAuth(() => {
                    auth = getAuth();
                    connectAuthEmulator(auth, 'http://localhost:9099');
                    return auth;
                })],
            providers: [
                MetadataService,
                NgxImageCompressService
            ]
        });

        metadata = TestBed.inject(MetadataService);
        imgCompress = TestBed.inject(NgxImageCompressService);

        listingUpload = new ListingUploadService(firestore, storage, metadata, imgCompress);
        listingEdit = new ListingEditService(firestore, storage);

        await signInWithEmailAndPassword(auth, 'test@test.test', 'test1234!')
    });

    afterEach(async () => {
        await auth.signOut();
    });

    /**
     * Create a dummy listing and upload to Firestore
     * Storage functionality is not tested as Storage emulator does not work with uploadBytes()...yet
     */
    it('should be able to upload a new listing, archive, unarchive and then delete it', async () => {
        async function getFile(index: number) {
            const response = await fetch(`test-assets/listing-upload-test-files/${index}.jpg`);
            const blob = await response.blob();
            return new File([blob], `${index}.jpg`, { type: blob.type });
        };

        function generateRandomListing(): Listing {
            return {
                propertyType: 'Apartment',
                location: 'Hung Gia 1',
                bedrooms: Math.floor(Math.random() * 100),
                bathrooms: Math.floor(Math.random() * 100),
                address: 'This is a` test',
                description: 'This is a test',
                archived: true,
                purpose: 'For Rent'
            }
        }

        // Publish the listing
        const listing = generateRandomListing();

        const numOfImages = 10;
        const imageFilesWithRandomImgs: ListingImageFile[] = [];
        for (let i = 0; i < numOfImages; i++) {
            const result = await getFile(i);
            imageFilesWithRandomImgs.push({ raw: result } as ListingImageFile);
        }

        let imageHasSize = false;
        imageFilesWithRandomImgs.forEach(img => {
            imageHasSize = imageHasSize || !!(img?.raw?.size);
        })
        expect(imageHasSize).toBe(true);

        let testDocId = await listingUpload.publishListing(listing, imageFilesWithRandomImgs);
        expect(testDocId).toBeTruthy();

        // Archive the listing
        listingEdit.archiveListing(testDocId);
        const archivedListing =
            (await getDoc(doc(collection(firestore, FirestoreCollections.listings), testDocId)))
                .data() as Listing;
        expect(archivedListing.archived).toBe(true);

        // Unarchive the listing
        listingEdit.unarchiveListing(testDocId);
        const unarchivedListing =
            (await getDoc(doc(collection(firestore, FirestoreCollections.listings), testDocId)))
                .data() as Listing;
        expect(unarchivedListing.archived).toBe(false);

        // Delete the listing
        let response = await getDoc(doc(collection(firestore, FirestoreCollections.listings), testDocId));
        expect(response.exists()).toBe(true);
        const listingFromServer = response.data() as Listing;
        const id = response.id;
        await listingEdit.deleteListing(listingFromServer, id);


        const docStillExistsOnDb = !!(await getDocs(collection(firestore, FirestoreCollections.listings))).docs.filter(doc => doc.id === id).length;
        expect(docStillExistsOnDb).toBe(false);
    });
})