import { TestBed } from "@angular/core/testing";
import { collection, doc, Firestore, FirestoreModule, getDoc, getFirestore, provideFirestore } from "@angular/fire/firestore";
import { Storage } from "@angular/fire/storage";
import { MetadataService } from "src/app/shared/metadata.service";
import { ListingUploadService } from "./listing-upload.service"
import { NgxImageCompressService } from "ngx-image-compress";
import { Listing, ListingImageFile } from "../listing-search/listing-search.data";
import { FirestoreCollections } from "src/app/shared/globals";
import { ListingEditService } from "../listing-edit/listing-edit.service";
import { firebaseConfig } from 'src/app/shared/globals';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";

describe('Listing Upload Service', () => {
    let listingUpload: ListingUploadService;
    let listingEdit: ListingEditService;
    let firestore: Firestore;
    let storage: Storage;
    let metadata: MetadataService;
    let imgCompress: NgxImageCompressService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                provideFirebaseApp(() => initializeApp(firebaseConfig)),
                provideFirestore(() => getFirestore()),
                FirestoreModule],
            providers: [
                Firestore,
                Storage,
                MetadataService,
                NgxImageCompressService
            ]
        })

        firestore = TestBed.inject(Firestore);
        storage = TestBed.inject(Storage);
        metadata = TestBed.inject(MetadataService);
        imgCompress = TestBed.inject(NgxImageCompressService);

        listingUpload = new ListingUploadService(firestore, storage, metadata, imgCompress);
        listingEdit = new ListingEditService(firestore, storage);
    })

    let testDocId: string;

    /**
     * Create a dummy listing and upload to Firestore and Storage
     */
    it('should be able to upload a new listing', async () => {
        function getFile() {
            return new File([""], "filename", { type: 'text/html' });
        };

        function generateRandomListing(): Listing {
            return {
                propertyType: 'Apartment',
                location: 'Hung Gia 1',
                bedrooms: Math.floor(Math.random() * 10),
                bathrooms: Math.floor(Math.random() * 10),
                address: 'This is a test',
                description: 'This is a test',
                archived: true,
                purpose: 'For Rent'
            }
        }

        const listing = generateRandomListing();
        const imageFilesWithRandomImgs = await Promise.all<ListingImageFile>((new Array(10)).map(async () => {
            const result = getFile();
            return { raw: result } as ListingImageFile;
        }));

        imageFilesWithRandomImgs.forEach(img => {
            expect(img!.raw!.size).toBeTruthy();
            console.log(img!.raw!.size);
        })

        testDocId = await listingUpload.publishListing(listing, imageFilesWithRandomImgs);
        expect(testDocId).toBeTruthy();


        const response = await getDoc(doc(collection(firestore, FirestoreCollections.listings), testDocId));
        const uploadedListing = response.data() as Listing;
        const uploadedListingId = response.id;

        expect(response.exists).toBe(true);
        expect(uploadedListingId).toBe(testDocId);
        expect(uploadedListing.imageFolderPath!.indexOf(uploadedListing.location!) != -1).toBe(true);



    });

    // it('should be able to modify an existing listing', async => {

    // });

    /**
     * Delete a listing and its images
     */
    // it('should be able to delete such listing', async () => {
    //     let doc = await firestore.collection(FirestoreCollections.listings).doc(testDocId).get().toPromise();

    //     expect(doc.exists).toBe(true);
    //     const listing = doc.data() as Listing;
    //     const id = doc.id;
    //     const storagePath = listing.imageFolderPath!;
    //     await listingEdit.deleteListing(listing, id);


    //     doc = await firestore.collection(FirestoreCollections.listings).doc(id).get().toPromise();
    //     expect(doc.exists).toBe(false);

    //     const numOfImages = (await storage.storage.ref(storagePath).listAll()).prefixes.length;
    //     expect(numOfImages).toBe(0);

    // });
})