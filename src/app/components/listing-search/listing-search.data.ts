import { SafeUrl } from "@angular/platform-browser"

export interface Listing {
    id: string,
    title: string,
    description?: string,
    coverImage?: string | SafeUrl,
    imageSources?: string[], //a listing could have 10+ images
    propertyType?: string,
    location?: string,
    address?: string,
    price?: string,
    propertySize?: string,
    bedrooms?: string,
    bathrooms?: string,
    forRent?: boolean,
    forSale?: boolean
}

export interface SearchCriteria {
    propertyType: string,
    location: string,
    minPrice: number,
    maxPrice: number,
    propertySize: string,
    bedrooms: string,
    bathrooms: string
}

export const PropertyTypes: { [key: string]: string } = {
    apartment: 'Apartment',
    villa: 'Villa',
    townhouse: 'Townhouse',
    office: 'Office'
}

export const Locations: { [key: string]: string } = {
    riverparkPremier: 'Riverpark Premier',
    midtownSakura: 'Midtown Sakura',
    leJardin: 'Le Jardin',
    namPhuc: 'Nam Phuc'
}

export const PropertySizes: { [key: string]: string } = {
    _050to100: '50 to 100',
    _100to200: '100 to 200',
    _200to300: '200 to 300',
    _300to400: '300 to 400',
    _400plus: 'Over 400'
}