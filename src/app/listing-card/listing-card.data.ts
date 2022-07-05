import { Timestamp } from "@angular/fire/firestore";

export interface Listing {
    id?: string // auto-generated Firebase Id
    title?: string
    description?: string
    coverImagePath?: string
    fireStoragePath?: string
    category?: Category
    subcategory?: string
    location?: string
    address?: string
    price?: number
    currency?: 'USD' | 'VND'; //ISO 4217
    propertySize?: number
    bedrooms?: number
    bathrooms?: number
    purpose?: Purpose
    contactNumber?: string
    contactPerson?: string
    contactChannels?: string[]
    view?: string //Referring to the property's living room's views
    featured?: boolean
    creationDate?: Timestamp
    createdBy?: string
    tiktokUrl?: string
    tagID?: string
    amenities?: string[]
}

export type Category = 'Apartment' | 'Villa' | 'Townhouse' | 'Commercial' | undefined;

export type Purpose = 'For Rent' | 'For Sale';

export const AMENITIES = [
    'amenities.gym',
    'amenities.pool',
    'amenities.conve_stores',
    'amenities.malls',
    'amenities.groceries',
    'amenities.schools',
    'amenities.hospitals',
    'amenities.parks',
    'amenities.transit',
    'amenities.quiet'
]