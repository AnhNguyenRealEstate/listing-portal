import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import * as currency from 'currency.js'
import * as fs from 'fs';
import * as path from 'path';

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


// exports.host = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
//   const isListingDetailsPage = req.url.indexOf('/listings/details/') == -1;
//   const indexHTMLpath = path.join(__dirname, 'hosting', 'index.html');
//   let indexHTML = fs.readFileSync(indexHTMLpath).toString();
//   const defaultDesc = 'Real estate services in District 7, Ho Chi Minh City';
//   const defaultTitle = 'Anh Nguyen Real Estate';
//   const defaultLogo = '/assets/images/logo.png';
//   const defaultUrl = 'https://anhnguyenre.com';

//   const getOpenGraph = async (isListingDetailsPage: boolean) => {
//     let og = `<meta property="og:type" content="website">`;

//     if (!isListingDetailsPage) {
//       og += `<meta property="og:title" content="${defaultTitle}" />`;
//       og += `<meta property="og:description" content="${defaultDesc}" />`;
//       og += `<meta property="og:image" content="${defaultLogo}" />
//             <meta property="og:image:type" content="image/*">
//             <meta property="og:image:width" content="1200">
//             <meta property="og:image:height" content="600">`;
//       og += `<meta property="og:url" content="${defaultUrl}" />`;
//       return og;
//     }

//     const urlComponents = req.url.split('/');
//     const listingID = urlComponents[urlComponents.length - 1];
//     const docRef = firebase.firestore().collection('listings').doc(listingID);
//     const listing = (await docRef.get()).data() as any;

//     const VND = (value: number) => currency(value, { symbol: "đ", separator: ",", precision: 2 });
//     const oneBillion = 1000000000;
//     const USD = (value: number) => currency(value, { symbol: "$", separator: "," });

//     let priceText = '';
//     if (listing.currency === 'VND') {
//       priceText = VND(listing['price']).divide(oneBillion).format();
//     } else if (listing.currency === 'USD') {
//       priceText = USD(listing['price']).format();
//     }
//     const ogTitle = `${listing['location']} - ${priceText}`;

//     const ogDesc = `${listing['address']}`;
//     const ogUrl = req.url;

//     const coverImageUrl = firebase.storage().bucket().file(listing['coverImagePath']).publicUrl();
//     const ogImage = `${coverImageUrl}`;

//     og += `< meta property = "og:title" content = "${ogTitle}}" /> `;
//     og += `< meta property = "og:description" content = "${ogDesc || defaultDesc}" /> `;
//     og += `< meta property = "og:image" content = "${ogImage || defaultLogo}" />
//           <meta property="og:image:type" content = "image/*" >
//           <meta property="og:image:width" content = "1200" >
//           <meta property="og:image:height" content = "600" > `;

//     og += `< meta property = "og:url" content = "${ogUrl || defaultUrl}" /> `;
//     return og;
//   };

//   const ogPlaceholder = '<meta name="functions-insert-dynamic-og">';
//   const ogReplacement = await getOpenGraph(isListingDetailsPage);
//   indexHTML = indexHTML.replace(ogPlaceholder, ogReplacement);
//   res.status(200).send(indexHTML);
// });

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