import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

exports.postProcessListingCreation = functions.region('asia-southeast1').firestore
  .document('listings/{documentId}')
  .onCreate((snap, context) => {
    const id = context.params.documentId;
    const creationDate = firebase.firestore.Timestamp.fromDate(new Date());
    return snap.ref.update(
      {
        'id': id,
        'creationDate': creationDate
      });
  });