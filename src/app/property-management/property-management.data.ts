import { Timestamp } from "@angular/fire/firestore"

export interface Property {
    name?: string
    id?: string //Firebase auto generated
    address?: string
    description?: string
    category?: string
    subcategory?: string
    managementStartDate?: Date
    managementEndDate?: Date
    activities?: Activity[]
    fileStoragePath?: string
    documents?: UploadedFile[]
    creationDate?: Timestamp,
    owner?: string
    rentalPrice?: number
}

export interface Activity {
    date?: Date
    description?: string
    documents?: UploadedFile[]
}

export interface UploadedFile {
    dbHashedName?: string
    displayName?: string
}