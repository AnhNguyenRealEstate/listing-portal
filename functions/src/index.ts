import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

exports.assignIdToListing = functions.firestore
  .document('listings/{documentId}')
  .onCreate((snap, context) => {
    const id = context.params.documentId;
    console.log('Updated document ' + id);
    return snap.ref.update({ 'id': id });
  }); 