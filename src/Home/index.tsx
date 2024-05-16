import ConcertCard from "../Concert/Card";
import {useEffect, useState} from "react";
import "./index.css";
import * as client from "../Concert/client";

export default function Home() {

  const [filters, setFilters] = useState({
    location: false,
    following: false,
    simple: false,
  });

  const [events, setEvents] = useState<[client.event]>([{
    identifier: "",
    performer: [{name: ""}],
    location: {
      name: "",
      address: {
        addressLocality: "",
        addressRegion: {
          alternateName: "",
        },
      },
    },
    startDate: "",
    image: "",
  }]);

  const fetchConcerts = async () => {
    const e = await client.getExampleConcerts();
    setEvents(e.events);
  }

  useEffect(() => {
    fetchConcerts();
  }, []);

  return (
      <div className="container py-3">
        <h1>Upcoming Concerts</h1>
        <div className="mt-3">
          <button className={`btn btn-${filters.location ? "light" : "dark"}`}
                  onClick={() => setFilters({...filters, location: !filters.location})}>Boston, MA
          </button>
          <button className={`btn btn-${filters.following ? "light" : "dark"} mx-3`}
                  onClick={() => setFilters({...filters, following: !filters.following})}>Following
          </button>
          <div className="form-check form-check-inline form-switch mx-3 float-end">
            <input className="form-check-input" type="checkbox" role="switch"
                   id="simpleSwitch" checked={filters.simple}
                   onChange={() => setFilters({...filters, simple: !filters.simple})}/>
            <label className="form-check-label" form="simpleSwitch">Simple View</label>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-md-between justify-content-center my-2">
          {!filters.simple && events && events.map((event) => (
                  <ConcertCard key={event.identifier} cardDetails={{
                    concertId: event.identifier,
                    title: event.performer[0].name,
                    venue: event.location.name,
                    city: event.location.address.addressLocality + ", " + event.location.address.addressRegion.alternateName,
                    date: new Date(event.startDate),
                    image: event.image,
                  }}/>
              )
          )}
          {filters.simple && events && <div className="card-group">
            <ul className="list-group list-group-horizontal">
              {events.map((event, i) => (
                      <li key={'event' + i}>
                        <ConcertCard cardDetails={{
                          concertId: event.identifier,
                          title: event.performer[0].name,
                          venue: event.location.name,
                          city: event.location.address.addressLocality + ", " + event.location.address.addressRegion.alternateName,
                          date: new Date(event.startDate),
                          image: event.image,
                        }}/>
                      </li>
                  )
              )}
            </ul>
          </div>}
        </div>
      </div>
  );
}