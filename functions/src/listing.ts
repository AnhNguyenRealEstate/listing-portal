import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * After a listing's creation
 * Update id and creation date for that listing
 */
exports.postProcessCreation = functions.region('asia-southeast1').firestore
    .document('listings/{documentId}')
    .onCreate(async (snap, context) => {

        const id = context.params.documentId;
        const creationDate = admin.firestore.Timestamp.fromDate(new Date());

        const category = snap.data()['category'] as string;
        const newTagID = await incrementCategoryCounter(category);

        return snap.ref.update(
            {
                'id': id,
                'creationDate': creationDate,
                'featured': false,
                'tagID': newTagID
            });
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

        if (oldListingLocation !== newListingData) {
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

exports.listingLocationsPruning = functions.region('asia-southeast1')
    .pubsub.schedule('every monday 02:00').timeZone('Asia/Ho_Chi_Minh').onRun(async () => {
        const listingDataDocRef = admin.firestore().doc('app-data/listing-data');
        const listingDataSnap = await listingDataDocRef.get();
        const listingData = listingDataSnap.data();
        if (!listingData) {
            return;
        }

        const locationsToKeep: string[] = [];
        const locationsToRemove: string[] = [];
        const locations = listingData['locations'] as string[];
        const listings = admin.firestore().collection('listings');
        for (const location in locations) {
            const listingsWithThisLocation = await listings.where('location', '==', location).get();
            if (listingsWithThisLocation.size) {
                locationsToKeep.push(location);
            } else {
                locationsToRemove.push(location);
            }
        }

        listingDataDocRef.update({ locations: locationsToKeep });
        functions.logger.log('The following locations have been pruned: ', locationsToRemove);
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