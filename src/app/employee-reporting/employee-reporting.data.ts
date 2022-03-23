import { Timestamp } from "@angular/fire/firestore";

export interface Report {
    id? : string, // FirebaseId
    author?: string,
    recipients?: Recipient[],
    date?: Timestamp,
    content?: string 
}

export interface Recipient {
    name?: string,
    email?: string
}