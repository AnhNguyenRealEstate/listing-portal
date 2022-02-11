import { TestBed } from "@angular/core/testing";
import { collection, connectFirestoreEmulator, Firestore, getDocs, getFirestore, provideFirestore } from "@angular/fire/firestore";
import { connectStorageEmulator, FirebaseStorage, getStorage, provideStorage } from "@angular/fire/storage";
import { ListingSearchService } from "./listing-search.service"
import { firebaseConfig, FirestoreCollections } from "src/app/shared/globals";
import { FirebaseApp, initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { Auth, connectAuthEmulator, getAuth, provideAuth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { Listing, SearchCriteria } from "../listing-search/listing-search.data";
import { MetadataService } from "src/app/shared/metadata.service";
import { NgxImageCompressService } from "ngx-image-compress";
import { ListingUploadService } from "../listing-upload/listing-upload.service";
import { ListingEditService } from "../listing-edit/listing-edit.service";


describe('Listing Search Service', () => {
    let firebaseApp: FirebaseApp;
    let firestore: Firestore;
    let storage: FirebaseStorage;
    let auth: Auth;

    let listingUpload: ListingUploadService;
    let listingSearch: ListingSearchService;
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
                })
            ],
            providers: [
                MetadataService,
                NgxImageCompressService
            ]
        });
        metadata = TestBed.inject(MetadataService);
        imgCompress = TestBed.inject(NgxImageCompressService);

        listingSearch = new ListingSearchService(firestore, storage);
        listingUpload = new ListingUploadService(firestore, storage, metadata, imgCompress);
        listingEdit = new ListingEditService(firestore, storage);

        await signInWithEmailAndPassword(auth, 'test@test.test', 'test1234!')
    });

    afterEach(async () => {
        await auth.signOut();
    });

    it(`should be able to create mock listings,
        search through them with criterias,
        get individual listings by firestore ID,
        and remove mock listings`, async () => {

        function generateRandomListing(index: number): Listing {
            return {
                propertyType: 'Apartment',
                location: 'Hung Gia 1',
                bedrooms: Math.floor(Math.random() * 3 + 1),
                bathrooms: Math.floor(Math.random() * 3 + 1),
                address: 'This is a test ' + index,
                description: 'This is a test' + index,
                archived: true,
                purpose: 'For Rent',
                price: Math.floor(Math.random() * 100) + 1000
            }
        }

        const criteria = {} as SearchCriteria;
        criteria.bathrooms = '2';
        criteria.bedrooms = '2';
        criteria.location = '';
        criteria.maxPrice = 9999;
        criteria.minPrice = 0;
        criteria.propertySize = '';
        criteria.propertyType = '';
        criteria.purpose = 'For Rent';

        const numOfListings = 30;
        const listings: Listing[] = [];
        for (let i = 0; i < numOfListings; i++) {
            listings.push(generateRandomListing(i));
        }

        const dbRefIDsOfListings = await Promise.all(listings.map(async listing => {
            return await listingUpload.publishListing(listing, []);
        }));

        expect(dbRefIDsOfListings.join('').length).toBeTruthy();

        const searchResultsFromServer = await listingSearch.getListingsByCriteria(criteria);

        const resultsThatDoNotOverlapWithResultsFromServer = listings.filter(listing =>
            !(String(listing.bathrooms) == criteria.bathrooms
                && String(listing.bedrooms) == criteria.bedrooms
                && listing.purpose == criteria.purpose)
        );

        let isSearchByCriteriaWorking = true;
        for (let i = 0; i < searchResultsFromServer.length; i++) {
            for (let j = 0; j < resultsThatDoNotOverlapWithResultsFromServer.length; j++) {
                // Two sets of results should not have any overlap, if we have such overlap,
                // getListingsByCriteria() has failed
                const hasOverlap = String(searchResultsFromServer[i].bathrooms) == String(resultsThatDoNotOverlapWithResultsFromServer[j].bathrooms)
                    && String(searchResultsFromServer[i].bedrooms) == String(resultsThatDoNotOverlapWithResultsFromServer[j].bedrooms)
                    && searchResultsFromServer[i].purpose == resultsThatDoNotOverlapWithResultsFromServer[j].purpose;
                if (hasOverlap) {
                    isSearchByCriteriaWorking = false;
                    break;
                }
            }
        }
        expect(isSearchByCriteriaWorking).toBe(true);

        // Check if we can randomly pull a listing we declared, 10 times
        for (let i = 0; i < 10; i++) {
            const randomIndexWithinRange = Math.floor(Math.random() * (searchResultsFromServer.length));
            const randomResult = searchResultsFromServer[randomIndexWithinRange];
            const randomListing = await listingSearch.getListingById(randomResult.id!);
            expect(randomListing).toBeTruthy();
        }

        // Delete the listings once we're done
        await Promise.all(dbRefIDsOfListings.map((id, index) => {
            return listingEdit.deleteListing(listings[index], id);
        }));
        const docsAfterDeletingMockListings = (await getDocs(collection(firestore, FirestoreCollections.listings))).docs;
        docsAfterDeletingMockListings.forEach(doc => {
            const ifDbStillHasAnyMockItem = dbRefIDsOfListings.includes(doc.id);
            expect(ifDbStillHasAnyMockItem).toBe(false);
        });
    });
})