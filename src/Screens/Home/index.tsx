import {useEffect, useState} from "react";
import "./index.css";
import * as concertClient from "../../Clients/concertClient";
import {Concert} from "../../Clients/Schemas/concerts";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SearchBar from "../../Components/SearchBar";
import SimpleDisplay from "../../Components/Displays/SimpleDisplay";

export default function Home() {
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
        <div className="my-4">
          <SearchBar searchFunction={() => console.log("hi")} placeholder="Filter by keyword"/>
        </div>
        <div>
          {isLoading && <div className="text-center">
            <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
          </div>}
          {concerts && <SimpleDisplay concerts={concerts}/>}
          {error && <ErrorModal error={error}/>}
        </div>
      </div>
  );
}