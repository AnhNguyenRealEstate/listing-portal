import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { OAuth2Client } from 'google-auth-library';
import { Timestamp } from "firebase-admin/firestore";
import axios, { AxiosRequestConfig } from 'axios';

/**
 * After a listing's creation
 * Update id and creation date for that listing
 */
exports.postProcessCreation = functions.region('asia-southeast1').firestore
    .document('listings/{documentId}')
    .onCreate(async (snap, context) => {

        const id = context.params.documentId;
        const creationDate = Timestamp.fromDate(new Date());

        const category = snap.data()['category'] as string;
        const newTagID = await incrementCategoryCounter(category);

        await snap.ref.update(
            {
                'id': id,
                'creationDate': creationDate,
                'featured': false,
                'tagID': newTagID
            });

        createGooglePost(snap.ref)
    });

/**
* After a listing's update
* Update app-data/listing-data/locations
*/
exports.postProcessUpdate = functions.region('asia-southeast1').firestore
    .document('listings/{documentId}')
    .onUpdate(async (change) => {
        const oldListingData = change.before.data();
        const oldListingLocation = oldListingData['location'];

        const newListingData = change.after.data();
        const newListingLocation = newListingData['location'];

        if (oldListingLocation !== newListingLocation) {
            updateLocationsMetadata(newListingLocation);
        }
    });

/**
* After a listing's removal
* Remove the listing's location if it is the last item to contain such location
*/
exports.postProcessDelete = functions.region('asia-southeast1').firestore
    .document('listings/{documentId}')
    .onDelete(async (snap) => {
        const locationOfDeletedListing = snap.data()['location'] as string;
        const listingsColSnap = await admin
            .firestore()
            .collection('listings')
            .where("location", "==", locationOfDeletedListing)
            .get();

        if (listingsColSnap.docs.length) {
            return;
        }

        const listingMetadataSnap = await admin.firestore().doc('app-data/listing-data').get();
        const listingMetadata = listingMetadataSnap.data();
        if (!listingMetadata) {
            return;
        }

        const locationsMetadata = listingMetadata['locations'] as string[];
        const newLocMetadata = locationsMetadata.filter(loc => loc !== locationOfDeletedListing);
        listingMetadataSnap.ref.update({
            "locations": newLocMetadata
        });
    });

exports.shuffleFeaturedListings = functions.region('asia-southeast1')
    .pubsub.schedule('0 0 * * 1,4').timeZone('Asia/Ho_Chi_Minh')
    .onRun(async () => {
        // Run every monday and thursday
        const numOfRecentlyUploadedToGet = 30;
        const recentUnfeaturedListings = (await admin.firestore().collection('listings')
            .orderBy('creationDate', 'desc')
            .where('featured', '==', false)
            .limit(numOfRecentlyUploadedToGet).get()
        ).docs;

        const currentlyFeaturedListings = (await admin.firestore().collection('listings')
            .where('featured', '==', true).get()
        ).docs;

        const numOfFeaturedListings = 8;
        const shuffled = recentUnfeaturedListings.sort(() => 0.5 - Math.random());
        const newListingsToFeature = shuffled.slice(0, numOfFeaturedListings);

        for (let i = 0; i < currentlyFeaturedListings.length; i++) {
            await currentlyFeaturedListings[i].ref.update('featured', false);
        }

        for (let i = 0; i < newListingsToFeature.length; i++) {
            await newListingsToFeature[i].ref.update('featured', true);
        }

    });

exports.createGooglePost = functions.region('asia-southeast1').https.onCall(async (data, _) => {
    const listingId = data.listingId
    if (!listingId) {
        return
    }

    const snap = await admin.firestore().doc(`listings/${listingId}`).get()
    await createGooglePost(snap.ref)
});

async function updateLocationsMetadata(location: string) {
    const listingMetadataSnap = await admin.firestore().doc('app-data/listing-data').get();
    const listingMetadata = listingMetadataSnap.data();

    let locationsMetadata: string[];
    if (listingMetadata && location) {
        locationsMetadata = listingMetadata['locations'] as string[];
        const locationAlreadyAdded = locationsMetadata.indexOf(location) != -1;
        if (!locationAlreadyAdded) {
            locationsMetadata.push(location);
            locationsMetadata.sort((a, b) => a.localeCompare(b));
            listingMetadataSnap.ref.update({
                'locations': locationsMetadata
            })
        }
    }
}

/**
 * 
 * @param category the category of the new listing
 * @returns the tagID to be assigned to the new listing
 */
async function incrementCategoryCounter(category: string): Promise<string> {
    const categoryCounterSnap = await admin.firestore().doc('app-data/category-counter').get();
    const categoryCounter = categoryCounterSnap.data();

    if (!categoryCounter) {
        return '';
    }

    let tagID: string = '';
    switch (category) {
        case 'Apartment':
            const aptCount = categoryCounter['apartment'];
            const newAptCount = aptCount + 1;
            tagID = `APT-${newAptCount}`;
            categoryCounterSnap.ref.update({
                'apartment': newAptCount
            })
            break;
        case 'Villa':
            const villaCount = categoryCounter['villa'];
            const newVillaCount = villaCount + 1;
            tagID = `VIL-${newVillaCount}`;
            categoryCounterSnap.ref.update({
                'villa': newVillaCount
            })
            break;
        case 'Townhouse':
            const thCount = categoryCounter['townhouse'];
            const newThCount = thCount + 1;
            tagID = `TH-${newThCount}`;
            categoryCounterSnap.ref.update({
                'townhouse': newThCount
            })
            break;
        case 'Commercial':
            const commercialCount = categoryCounter['commercial'];
            const newCommCount = commercialCount + 1;
            tagID = `COM-${newCommCount}`;
            categoryCounterSnap.ref.update({
                'commercial': newCommCount
            })
            break;
        default:
            break;
    }

    return tagID;
}

async function createGooglePost(documentRef: admin.firestore.DocumentReference) {
    if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
        return
    }

    if (!(process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET
        && process.env.GOOGLE_BUSINESS_API_KEY && process.env.GOOGLE_ACCOUNT_ID
        && process.env.GOOGLE_LOCATION_ID && process.env.RYTR_API_KEY)) {
        return
    }

    const docSnap = await documentRef.get()
    const data = docSnap.data()
    if (!data) {
        throw new Error('Listing does not exist')
    }

    const accountId = process.env.GOOGLE_ACCOUNT_ID
    const locationId = process.env.GOOGLE_LOCATION_ID
    const summary = await getSummaryFromRytr(data)
    if (!summary) {
        throw new Error('Cannot get response from Rytr')
    }

    const listingUrl = `https://anhnguyenre.com/listings/details/${data['id']}`

    await admin.storage().bucket().file(data['coverImagePath']).makePublic()
    const coverPhotoUrl = admin.storage().bucket().file(data['coverImagePath']).publicUrl()

    const client = new OAuth2Client(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.REDIRECT_URI
    )

    const accessTokenResp = await client.getAccessToken()
    if (!accessTokenResp.token) {
        throw new Error('Could not get OAuth access token')
    }

    const googlePostData = {
        languageCode: "en-US",
        summary: `${summary}`,
        callToAction: {
            actionType: "LEARN_MORE",
            url: `${listingUrl}`,
        },
        media: [
            {
                mediaFormat: "PHOTO",
                sourceUrl: `${coverPhotoUrl}`,
            }
        ],
        topicType: "STANDARD"
    }

    const axiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessTokenResp.token}`
        }
    }

    await axios.post(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
        googlePostData,
        axiosRequestConfig
    )
}

async function getSummaryFromRytr(data: any) {
    if (!data) {
        throw new Error('No data to summarize')
    }

    const amenitiesMap = new Map<string, string>([
        ['amenities.gym', 'gym'],
        ['amenities.pool', 'pool'],
        ['amenities.conve_stores', 'convenient store'],
        ['amenities.malls', 'malls'],
        ['amenities.groceries', 'groceries'],
        ['amenities.schools', 'schools'],
        ['amenities.hospitals', 'hospitals'],
        ['amenities.parks', 'parks'],
        ['amenities.transit', 'transit'],
        ['amenities.quiet', 'quiet'],
        ['amenities.parking', 'parking']
    ])

    let amenities;
    if (data['amenities']?.length) {
        amenities = (data['amenities'] as string[])
            .map(item => amenitiesMap.get(item))
            .join(', ')
    } else {
        amenities = 'none'
    }

    const productDescr =
        `${data['bedrooms']} bedroom(s). ${data['bathrooms']} bathroom(s). Nearby amenities: ${amenities}. ${data['price']} ${data['currency']} ${data['purpose']}`
            .slice(0, 250)
    const productNameLabel = `${data['location']} ${data['category']}`.slice(0, 25)

    const apiKey = process.env.RYTR_API_KEY
    const apiUrl = process.env.RYTR_API_URL
    const languageIdEnglish = '607adac76f8fe5000c1e636d'
    const toneIdConvincing = '60572a639bdd4272b8fe358b'
    const useCaseIdProductDescr = '605832f78c0a4a000c69c960'

    try {
        const data = {
            languageId: languageIdEnglish,
            toneId: toneIdConvincing,
            useCaseId: useCaseIdProductDescr,
            inputContexts: {
                "PRODUCT_NAME_LABEL": productNameLabel,
                "ABOUT_PRODUCT_LABEL": productDescr
            },
            variations: 3,
            userId: 'FIREBASE_CLOUD_FUNCTION',
            format: 'text',
            creativityLevel: "low"
        }

        const axiosRequestConfig = {
            headers: {
                Authentication: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        } as AxiosRequestConfig

        const response = await axios.post(
            `${apiUrl}/ryte`,
            data,
            axiosRequestConfig
        )

        return response.data?.data?.length ? response.data.data[0].text : ''
    } catch (error) {
        console.log(error)
    }

}