export enum ConcertSource {
  DISCOVERY = "Discovery",
  SETLIST_FM = "Setlist.fm",
  USER = "User",
}


export interface ConcertSearchParams { // filters for searching a concert (using concert data)
  userId?: string,
  keyword?: string,
  artist?: string,
  venue?: string,
  city?: string,
  startDate?: string,
  endDate?: string,
  sort?: boolean,
  following?: boolean, // whether a user this user follows has saved the concert
  saved?: boolean, // whether the user has saved the concert
}


export interface Concert {
  _id: string,
  discoveryId?: string,
  title: string,
  artists: {
    name: string,
    image?: string,
  }[],
  venue: {
    name: string,
    city: string,
    state?: string,
    country: string,
    address?: string,
  },
  attendingUsers: string[],
  image?: string,
  startDate: Date,
  endDate?: Date,
  ticketInfo?: {
    url?: string,
    priceRange?: {
      min?: number,
      max?: number,
      currency?: string,
    },
  },
  setlist?: string[],
  source: ConcertSource,
  tags?: string[],
  createdAt?: Date,
}


export interface DiscoveryConcert {
  id: string,
  name: string,
  url: string,
  locale: string,
  images: {
    url: string,
  }[],
  dates: {
    start: {
      dateTime?: string,
      localDate: string,
      localTime?: string,
    },
    end?: {
      dateTime: Date,
    },
  },
  priceRanges?: {
    currency: string,
    min: number,
    max: number,
  }[],
  classifications?: {
    genre?: { name: string },
    subGenre?: { name: string },
  }[],
  _embedded: {
    venues: {
      name: string,
      city: {
        name: string,
      },
      country: {
        name: string,
        countryCode: string,
      },
      address?: {
        line1: string,
      },
      location?: {
        latitude: number,
        longitude: number,
      },
    }[],
    attractions: {
      name: string,
      images: {
        url: string,
      }[],
    }[],
  },
}