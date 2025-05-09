import axios from "axios";
import {Concert, ConcertSearchParams, ConcertSource, DiscoveryConcert} from "./Schemas/concerts";

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

export const findOrCreateConcert = async (concert: Concert) => {
  const res = await api.post(`${NODE_API}/concerts/find`, concert);
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

export const fetchConcerts = async (searchParams: ConcertSearchParams) => {
  const res = await api.get(`${NODE_API}/concerts/no-auth`, {params: searchParams});
  return res.data;
}

export const searchConcerts = async (searchParams: ConcertSearchParams, token: string) => {
  const res = await api.get(`${NODE_API}/concerts`, {
    params: searchParams,
    headers: {'Authorization': `Bearer ${token}`}
  });
  return res.data;
}

export const searchDiscoveryConcerts = async (params: any) => {
  const res = await api.get(`${NODE_API}/discovery/events`, {params});
  const concerts = res.data._embedded?.events;
  return concerts ? concerts.map((event: DiscoveryConcert) => (convertDiscoveryConcertToConcert(event))) : [];
}

function convertDiscoveryConcertToConcert(discovery: DiscoveryConcert): Concert {
  const venue = discovery._embedded.venues?.[0]
  const genreTags = new Set<string>();
  if (discovery.classifications?.[0]?.genre?.name) {
    genreTags.add(discovery.classifications?.[0]?.genre?.name)
  }
  if (discovery.classifications?.[0]?.subGenre?.name) {
    genreTags.add(discovery.classifications?.[0]?.subGenre?.name)
  }
  if (genreTags.has("Undefined")) {
    genreTags.delete("Undefined");
    genreTags.add("Other");
  }

  return {
    _id: discovery.id,
    discoveryId: discovery.id,
    artists: discovery._embedded.attractions?.map(attraction => ({
      name: attraction.name,
      image: attraction.images?.find(i => i.ratio === '16_9' && i.height > 700)?.url,
    })),
    endDate: discovery.dates.end?.dateTime,
    image: discovery.images?.find(i => i.ratio === '16_9' && i.height > 700)?.url,
    setlist: [],
    source: ConcertSource.DISCOVERY,
    startDate: discovery.dates.start.dateTime ?
        new Date(discovery.dates.start.dateTime) :
        new Date(`${discovery.dates.start.localDate}T${discovery.dates.start.localTime || '00:00:00'}`),
    tags: Array.from(genreTags.values()),
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
    attendingUsers: [],
  }
}