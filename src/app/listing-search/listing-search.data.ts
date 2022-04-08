import { Timestamp } from "@angular/fire/firestore"

export interface Listing {
    id?: string // auto-generated Firebase Id
    title?: string
    description?: string
    coverImagePath?: string,
    fireStoragePath?: string
    category?: 'Apartment' | 'Villa' | 'Townhouse' | 'Commercial' | undefined
    location?: string
    address?: string
    price?: number
    currency?: 'USD' | 'VND' //ISO 4217
    propertySize?: number
    bedrooms?: number
    bathrooms?: number
    purpose?: 'For Rent' | 'For Sale'
    archived?: boolean
    contactNumber?: string
    contactPerson?: string,
    contactChannels?: string[],
    view?: string //Referring to the property's living room's views,
    featured?: boolean,
    creationDate?: Timestamp,
    createdBy?: string
}

export interface ListingImageFile {
    file: File
    description?: string
}

export interface SearchCriteria {
    category: string
    location: string
    minPrice: number
    maxPrice: number | undefined
    propertySize: string
    bedrooms: string
    bathrooms: string
    purpose: 'For Rent' | 'For Sale'
    orderBy: 'Most Recent' | 'Most Affordable'
}

/* The following const is used for searching purposes ONLY */
export const PropertySizes: { [key: string]: string } = {
    _050to100: '50 - 100',
    _100to200: '100 - 200',
    _200to300: '200 - 300',
    _300to400: '300 - 400',
    _400plus: '400+'
}