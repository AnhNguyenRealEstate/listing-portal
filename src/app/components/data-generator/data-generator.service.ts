import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Listing } from '../listing-search/listing-search.data';
import { SafeUrl } from "@angular/platform-browser";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class DataGeneratorService {
    constructor(
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer,
        private firestore: AngularFirestore,
        private storage: AngularFireStorage) {

    }

    generateListings(numberOfEntries: number) {
        const firebaseRef = this.firestore.collection('listings');
        for (let i = 0; i < numberOfEntries; i++) {
            const price = Math.ceil(Math.random() * i * 100) + 500;
            const listing = {
                id: `${i}`,
                title: `Property ${i}`,
                address: `${i} Nguyen Duc Canh, District 7, Ho Chi Minh City`,
                propertyType: ['Villa', 'Office', 'Townhouse', 'Apartment'][i % 4],
                location: ['Riverpark Premier', 'Midtown Sakura', 'Le Jardin', 'Nam Phuc'][i % 4],
                price: price,
                purpose: price > 3000 ? 'For Sale' : 'For Rent'
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

    async generateImageSrcs(listing: Listing, numberOfImages: number = 2) {
        if (!listing) {
            return;
        }

        listing.imageSources = [] as SafeUrl[];
        for (let i = 0; i < numberOfImages; i++) {
            const response = await this.httpClient
                .get(
                    `https://picsum.photos/200?query=${i}`,
                    { responseType: 'blob' }
                ).toPromise().catch(error => console.log(error));

            if (!response) {
                continue;
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
}