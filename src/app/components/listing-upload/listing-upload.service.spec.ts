import { TestBed } from "@angular/core/testing";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { AppDataService } from "src/app/shared/app-data.service";
import { ListingUploadService } from "./listing-upload.service"
import { NgxImageCompressService } from "ngx-image-compress";
import { Listing } from "../listing-search/listing-search.data";

describe('Listing Upload Service', () => {
    let listingUpload: ListingUploadService;
    let firestore: AngularFirestore;
    let storage: AngularFireStorage;
    let appData: AppDataService;
    let imgCompress: NgxImageCompressService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AngularFirestore, AngularFireStorage, AppDataService, NgxImageCompressService]
        })

        firestore = TestBed.inject(AngularFirestore);
        storage = TestBed.inject(AngularFireStorage);
        appData = TestBed.inject(AppDataService);
        imgCompress = TestBed.inject(NgxImageCompressService);

        listingUpload = new ListingUploadService(firestore, storage, appData, imgCompress);
    })

    it('should be able to upload a new listing', () => {
        // const listing = {} as Listing;
        // const imageFiles: File[] = [];
        // listingUpload.publishListing(listing, imageFiles);
    })
})