import { Timestamp } from "@angular/fire/firestore"

export interface Property {
    name?: string
    id?: string //Firebase auto generated
    activities?: Activity[]
    documentStoragePath?: string 
}

export interface Activity {
    date?: Timestamp
    content?: string
}