import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Listing, Locations, PropertyTypes } from '../listing-search/listing-search.data';
import { SafeUrl } from "@angular/platform-browser";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { AppDataService } from 'src/app/shared/app-data.service';

@Injectable({ providedIn: 'root' })
export class DataGeneratorService implements OnDestroy {
    propertyTypes: string[] = [];
    locations: string[] = [];
    subs: Subscription = new Subscription();
    
    constructor(
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer,
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private appDataService : AppDataService) {

            this.subs.add(this.appDataService.propertyTypes().subscribe(data => {
                this.propertyTypes = data;
            }));
            
            this.subs.add(this.appDataService.locations().subscribe(data => {
                this.locations = data;
            }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    
    generateListings(numberOfEntries: number) {
        const firebaseRef = this.firestore.collection('listings');
        for (let i = 0; i < numberOfEntries; i++) {
            const price = Math.ceil(Math.random() * i * 100) + 500;
            const listing = {
                id: `${i}`,
                title: `Property ${i}`,
                address: `${(i + 1) * 10} Nguyen Duc Canh, Tan Phong, District 7, Ho Chi Minh City`,
                propertyType: this.propertyTypes[i % 4],
                location: this.locations[i % 4],
                price: price,
                purpose: price > 3000 ? 'For Sale' : 'For Rent',
                bathrooms: i % 4,
                bedrooms: i % 5
            } as Listing;

            const date = new Date();
            const imageFolderName =
                `${listing.location}-${date.getMonth()}${date.getDate()}-${Math.random() * 1000000}`;
            this.storage.ref(`listing-images/${imageFolderName}/testObject`)
                .put({ 'test': 'This is meant to be an image' })
                .catch(error => console.log(error));
            listing.imageFolderPath = `listing-images/${imageFolderName}`;

            firebaseRef.add(listing).catch(error => console.log(error));
        }
    }

    async generateImageSrcs(listing: Listing, numberOfImages: number) {
        if (!listing) {
            return;
        }

        listing.imageSources = [] as SafeUrl[];
        for (let i = 0; i < numberOfImages; i++) {
            const response = await this.httpClient
                .get(
                    `https://picsum.photos/200?random&t=${Math.random()}`,
                    { responseType: 'blob' }
                ).toPromise().catch(error => console.log(error));

            if (!response) {
                return;
            }

            const blob = new Blob([response], { type: 'application/image' });
            const unsafeImg = URL.createObjectURL(blob);
            const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);

            (listing.imageSources as SafeUrl[]).push(imageUrl);

            const isFirstImg = i === 0;
            if (isFirstImg) {
                listing.coverImage = imageUrl;
            }
        }
    }

    async deleteAll() {
        const firestoreRef = this.firestore.collection('listings');
        const dbResponse = await firestoreRef.get().toPromise().catch(error => console.log(error));

        if (!dbResponse) {
            return;
        }

        const docs = dbResponse.docs;
        for (let i = 0; i < docs.length; i++) {
            const allImgs = await this.storage.storage.ref((docs[i].data() as Listing).imageFolderPath!).listAll();
            for(let i = 0; i < allImgs.items.length; i ++){
                allImgs.items[i].delete();
            }
            await firestoreRef.doc(docs[i].id).delete();
        }
    }
}