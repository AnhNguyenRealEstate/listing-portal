import { Timestamp } from "@angular/fire/firestore";

export interface Inquiry {
    id?: string, //Automatically created by Firebase
    title?: string,
    contactMethod?: string,
    message?: string,
    creationDate?: Timestamp
}