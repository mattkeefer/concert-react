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

export enum ConcertSource {
  TICKETMASTER = "Ticketmaster",
  SETLIST_FM = "Setlist.fm",
}

export interface ConcertSearchParams {
  artist?: string,
  venue?: string,

  // id?: string,
  // keyword?: string,
  // attractionId?: string,
  // venueId?: string,
  // postalCode?: string,
  // marketId?: string,
  // startDateTime?: string,
  // endDateTime?: string,
  // size?: number,
  // page?: number,
  // sort?: string,
  // city?: string,
  // countryCode?: string,
  // stateCode?: string,
  // localStartDateTime?: string,
  // genreId?: string,
  // subGenreId?: string,
  // typeId?: string,
  // subTypeId?: string,
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
    latitude?: number,
    longitude?: number,
  },
  image?: string, // image href
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