export interface Listing {
    id?: string, // auto-generated Firebase Id
    title?: string,
    description?: string,
    coverImage?: string, // Download url or data url, input for img.src
    imageFolderPath?: string;
    images?: ListingImageFile[];
    imageSources?: string[],
    propertyType?: string,
    location?: string,
    address?: string,
    price?: number,
    currency?: 'USD' | 'VND'
    propertySize?: number,
    bedrooms?: number,
    bathrooms?: number,
    purpose?: 'For Rent' | 'For Sale',
    archived?: boolean
}

export interface ListingImageFile {
    compressed: File,
    raw: File
}

export interface SearchCriteria {
    propertyType: string,
    location: string,
    minPrice: number,
    maxPrice: number,
    propertySize: string,
    bedrooms: string,
    bathrooms: string,
    purpose: 'For Rent' | 'For Sale'
}

/* The following const is used for searching purposes ONLY */
export const PropertySizes: { [key: string]: string } = {
    _050to100: '50 - 100',
    _100to200: '100 - 200',
    _200to300: '200 - 300',
    _300to400: '300 - 400',
    _400plus: '400+'
}