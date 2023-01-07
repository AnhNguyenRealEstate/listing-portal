
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
    orderBy: 'Most Recent' | 'Most Affordable' | 'Least Recent' | 'Least Affordable'
}

/* The following const is used for searching purposes ONLY */
export const PropertySizes: { [key: string]: string } = {
    _050to100: '50 - 100',
    _100to200: '100 - 200',
    _200to300: '200 - 300',
    _300to400: '300 - 400',
    _400plus: '400+'
}