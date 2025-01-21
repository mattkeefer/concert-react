import axios from "axios";

const api = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const createConcert = async (concert: Concert) => {
  const res = await api.post(`${NODE_API}/concerts`, concert);
  return res.data;
}

export const getConcertById = async (id: string) => {
  const res = await api.get(`${NODE_API}/concerts/${id}`);
  return res.data;
}

export const updateConcert = async (concertId: string, concert: Concert) => {
  const res = await api.put(`${NODE_API}/concerts/${concertId}`, concert);
  return res.data;
}

export const deleteConcert = async (concertId: string) => {
  const res = await api.delete(`${NODE_API}/concerts/${concertId}`);
  return res.data;
}

export const searchConcerts = async (searchParams: ConcertSearchParams) => {
  const res = await api.get(`${NODE_API}/concerts`);
  return res.data;
}

export const searchDiscoveryConcerts = async (params: any) => {
  const res = await api.get(`${NODE_API}/discovery/events`, {params});
  const concerts = res.data._embedded?.events;
  return concerts ? concerts.map((event: DiscoveryConcert) => (convertDiscoveryToConnect(event))) : [];
}

export enum ConcertSource {
  DISCOVERY = "Discovery",
  SETLIST_FM = "Setlist.fm",
}

export interface ConcertSearchParams {
  artist?: string,
  venue?: string,

}

export interface Concert {
  _id: string,
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

function convertDiscoveryToConnect(discovery: DiscoveryConcert): Concert {
  const venue = discovery._embedded.venues?.[0]
  const genreTags = []
  if (discovery.classifications?.[0]?.genre?.name) {
    genreTags.push(discovery.classifications?.[0]?.genre?.name)
  }
  if (discovery.classifications?.[0]?.subGenre?.name) {
    genreTags.push(discovery.classifications?.[0]?.subGenre?.name)
  }

  return {
    _id: "",
    artists: discovery._embedded.attractions?.map(attraction => ({
      name: attraction.name,
      image: attraction.images?.[0]?.url,
    })),
    endDate: discovery.dates.end?.dateTime,
    image: discovery.images?.[0]?.url,
    setlist: [],
    source: ConcertSource.DISCOVERY,
    startDate: discovery.dates.start.dateTime ?
        new Date(discovery.dates.start.dateTime) :
        new Date(`${discovery.dates.start.localDate}T${discovery.dates.start.localTime || '00:00:00'}`),
    tags: genreTags,
    ticketInfo: {
      url: discovery.url,
      priceRange: discovery.priceRanges ? {
        min: discovery.priceRanges[0]?.min,
        max: discovery.priceRanges[0]?.max,
        currency: discovery.priceRanges[0]?.currency,
      } :
          undefined,
    },
    title: discovery.name,
    venue: {
      name: venue?.name || "Unknown Venue",
      city: venue?.city?.name || "Unknown City",
      country: venue?.country?.countryCode || "Unknown Country",
      address: venue?.address?.line1 || "Unknown Address",
    },
  }
}