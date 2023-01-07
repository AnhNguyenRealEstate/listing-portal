import * as functions from "firebase-functions"
import * as admin from "firebase-admin";

exports.postProcessDelete = functions.region('asia-southeast1').firestore
    .document('projects/{projectId}')
    .onDelete((snap, context) => {
        const deletedProject = snap.data()
        const storagePath = deletedProject['fireStoragePath']
        admin.storage().bucket().deleteFiles(
            {
                prefix: storagePath
            }
        )

        
    })