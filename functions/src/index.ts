import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

firebase.initializeApp();

/**
 * After a listing's creation
 * Update id an creation date for a listing upon upload
 */
exports.postProcessListingCreation = functions.region('asia-southeast1').firestore
  .document('listings/{documentId}')
  .onCreate((snap, context) => {
    const id = context.params.documentId;
    const creationDate = firebase.firestore.Timestamp.fromDate(new Date());

    const location = snap.data()['location'] as string;
    updateLocationsMetadata(location);

    return snap.ref.update(
      {
        'id': id,
        'creationDate': creationDate
      });
  });

/**
 * Update app-data/listing-data/locations
 */
exports.postProcessListingUpdate = functions.region('asia-southeast1').firestore
  .document('listings/{documentId}')
  .onUpdate(async (change) => {
    const listingData = change.after.data();
    const listingLocation = listingData['location'];
    updateLocationsMetadata(listingLocation);
  });

/**
* After a listing's update
* Update app-data/listing-data/locations
*/
exports.postProcessListingUpdate = functions.region('asia-southeast1').firestore
  .document('listings/{documentId}')
  .onUpdate(async (change) => {
    const listingData = change.after.data();
    const listingLocation = listingData['location'];
    updateLocationsMetadata(listingLocation);
  });

/**
 * After a listing's removal
 * Remove the listing's location if it is the last item to contain such location
 */
exports.postProcessListingDelete = functions.region('asia-southeast1').firestore
  .document('listings/{documentId}')
  .onDelete(async (snap) => {
    const locationOfDeletedListing = snap.data()['location'] as string;
    const listingsColSnap = await firebase
      .firestore()
      .collection('listings')
      .where("location", "==", locationOfDeletedListing)
      .get();

    if (listingsColSnap.docs.length) {
      return;
    }

    const listingMetadataSnap = await firebase.firestore().doc('app-data/listing-data').get();
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


async function updateLocationsMetadata(location: string) {
  const listingMetadataSnap = await firebase.firestore().doc('app-data/listing-data').get();
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