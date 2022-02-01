import { TestBed } from "@angular/core/testing";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { MetadataService } from "src/app/shared/metadata.service";
import { ListingUploadService } from "./listing-upload.service"
import { NgxImageCompressService } from "ngx-image-compress";

describe('Listing Upload Service', () => {
    let listingUpload: ListingUploadService;
    let firestore: AngularFirestore;
    let storage: AngularFireStorage;
    let metadata: MetadataService;
    let imgCompress: NgxImageCompressService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AngularFirestore, AngularFireStorage, MetadataService, NgxImageCompressService]
        })

        firestore = TestBed.inject(AngularFirestore);
        storage = TestBed.inject(AngularFireStorage);
        metadata = TestBed.inject(MetadataService);
        imgCompress = TestBed.inject(NgxImageCompressService);

        listingUpload = new ListingUploadService(firestore, storage, metadata, imgCompress);
    })

    it('should be able to upload a new listing', () => {
        // const listing = {} as Listing;
        // const imageFiles: File[] = [];
        // listingUpload.publishListing(listing, imageFiles);
    })
})