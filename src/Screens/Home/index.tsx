import ConcertCard from "../../Components/Card";
import {useEffect, useState} from "react";
import "./index.css";
import * as concertClient from "../../Clients/concertClient";
import {Concert} from "../../Clients/Schemas/concerts";
import ErrorModal from "../../Components/ErrorModal";

export default function Home() {

  const [filters, setFilters] = useState({
    location: false,
    following: false,
    simple: true,
  });
  const [concerts, setConcerts] = useState<[Concert]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const fetchConcerts = async () => {
    try {
      setIsLoading(true);
      const res = await concertClient.searchConcerts({startDate: new Date().toDateString()});
      setConcerts(res);
      setIsLoading(false);
    } catch (err: any) {
      setError(err)
    }
  }

  useEffect(() => {
    fetchConcerts();
  }, []);

  return (
      <div className="container py-3">
        <h1>Upcoming Concerts</h1>
        <div className="d-flex mt-3 align-items-center flex-wrap clearfix">
          <div>
            <button className={`btn btn-${filters.location ? "light" : "dark"}`}
                    onClick={() => setFilters({...filters, location: !filters.location})}>Boston, MA
            </button>
          </div>
          <div>
            <button className={`btn btn-${filters.following ? "light" : "dark"} mx-3`}
                    onClick={() => setFilters({
                      ...filters,
                      following: !filters.following
                    })}>Following
            </button>
          </div>
          <div className="form-check form-check-inline form-switch me-0 ms-auto">
            <input className="form-check-input" type="checkbox" role="switch"
                   id="simpleSwitch" checked={filters.simple}
                   onChange={() => setFilters({...filters, simple: !filters.simple})}/>
            <label className="form-check-label" form="simpleSwitch">Simple View</label>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-md-between justify-content-center my-2">
          {isLoading && <div className="text-center">
            <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
          </div>}
          {!isLoading && !filters.simple && concerts && concerts.map((concert) => (
              <ConcertCard key={concert._id} concert={concert}/>)
          )}
          {!isLoading && filters.simple && concerts && <div className="card-group">
            <ul className="list-group list-group-horizontal">
              {concerts.map((concert, i) => (
                      <li key={'event' + i}>
                        <ConcertCard concert={concert}/>
                      </li>
                  )
              )}
            </ul>
          </div>}
          {error && <ErrorModal error={error}/>}
        </div>
      </div>
  );
}