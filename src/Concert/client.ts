import axios from "axios";

const api = axios.create({
  withCredentials: true,
});
const NODE_API = process.env.REACT_APP_BASE_API;

export const getAllConcerts = async () => {
  const res = await api.get(`${NODE_API}/api/concerts`);
  return res.data;
}

export const createConcert = async (concert: any) => {
  const res = await api.post(`${NODE_API}/api/concerts`, concert);
  return res.data;
}

export const getConcert = async (source: any, id: any) => {
  const res = await api.get(`${NODE_API}/api/concerts/${source}/${id}`);
  return res.data;
}

export const getConcertsByIds = async (concertIds: any) => {
  const res = await api.post(`${NODE_API}/api/concerts/ids`, concertIds);
  return res.data;
}

export const updateConcert = async (concertId: any, concert: any) => {
  const res = await api.put(`${NODE_API}/api/concerts/${concertId}`, concert);
  return res.data;
}

export const deleteConcert = async (concertId: any) => {
  const res = await api.delete(`${NODE_API}/api/concerts/${concertId}`);
  return res.data;
}

interface Genre {
  id: string,
  name: string,
  locale: string,
}

interface Image {
  url: string,
  ratio: string, // 16_9, 3_2, 4_3
  width: number,
  height: number,
  fallback: boolean,
  attribution: string,
}

export interface Artist {
  type: string,
  id: string,
  name: string,
  url: string,
  images: Image[],
}

export interface Venue {
  id: string,
  name: string,
}

export interface Event {
  _id?: string,
  id: string,
  name: string,
  description: string,
  additionalInfo: string,
  type: string,
  distance: number,
  units: string,
  location: {
    latitude: number,
    longitude: number,
  },
  locale: string,
  url: string,
  images: Image[],
  dates: {
    start: {
      localDate: string,
      localTime: string,
      dateTime: string,
      dateTBD: boolean,
      dateTBA: boolean,
      timeTBA: boolean,
      noSpecificTime: boolean,
    },
    end: {
      localDate: string,
      localTime: string,
      dateTime: string,
      approximate: boolean,
      noSpecificTime: boolean,
    },
    access: {
      startDateTime: string,
      startApproximate: boolean,
      endDateTime: string,
      endApproximate: boolean,
    },
    timezone: string,
    status: {
      code: string, // onsale, offsale, canceled, postponed, rescheduled
    },
    spanMultipleDays: boolean,
  },
  sales: {
    public: {
      startDateTime: string,
      endDateTime: string,
      startTBD: boolean,
    },
    presales: {
      name: string,

      description: string,
      url: string,
      startDateTime: string,
      endDateTime: string,
    }[],
  },
  info: string,
  pleaseNote: string,
  priceRanges: {
    type: string, // standard
    currency: string,
    min: number,
    max: number,
  }[],
  accessibility: {
    info: string,
  },
  classifications: {
    primary: boolean,
    segment: {
      genres: [{
        subGenres: Genre[],
        id: string,
        name: string,
        locale: string,
      }],
      id: string,
      name: string,
      locale: string,
    },
    genre: Genre,
    subGenre: Genre,
  }[],
  place: {
    area: {
      name: string,
    },
    address: {
      line1: string,
      line2: string,
      line3: string,
    },
    city: {
      name: string,
    },
    state: {
      stateCode: string,
      name: string,
    },
    country: {
      countryCode: string,
      name: string,
    },
    postalCode: string,
    location: {
      longitude: number,
      latitude: number,
    },
    name: string,
  },
  interestedUsers: string[],
  attendingUsers: string[],
  _embedded: {
    venues: Venue[],
    attractions: Artist[],
  },
}

export interface SimpleConcert {
  concertId: string,
  title: string,
  artists: { name: string, image: string }[],
  venue: string,
  city: string,
  date: Date,
  image: string,
}

export function parseConcertFromEvent(event: Event): SimpleConcert {
  return {
    concertId: event.id,
    title: event.name,
    artists: event._embedded.attractions.map((a: Artist) => ({
      name: a.name,
      image: a.images[0].url
    })),
    venue: event._embedded.venues[0].name,
    city: event.location.address.addressLocality + ", " +
        (event.location.address.addressRegion ? (event.location.address.addressRegion.alternateName + ", ") : "") +
        event.location.address.addressCountry.identifier,
    date: new Date(event.startDate),
    image: event.image,
  }
}