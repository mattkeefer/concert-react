import {useEffect, useRef, useState} from "react";
import "./index.css";
import * as concertClient from "../../Clients/concertClient";
import {Concert, ConcertSearchParams} from "../../Clients/Schemas/concerts";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SearchBar from "../../Components/SearchBar";
import SimpleDisplay from "../../Components/Displays/SimpleDisplay";
import {Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {UserAuthState} from "../../Store";

export default function Home() {
  const [concerts, setConcerts] = useState<[Concert]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [filters, setFilters] = useState<ConcertSearchParams>();
  const [keyword, setKeyword] = useState("");
  const userAuth = useSelector((state: UserAuthState) => state.userAuthReducer.userAuth);

  const fetchConcerts = async () => {
    try {
      setIsLoading(true);
      const res = await concertClient.fetchConcerts({startDate: new Date().toDateString()});
      setConcerts(res);
      setIsLoading(false);
    } catch (err: any) {
      setError(err);
    }
  }

  const searchConcerts = async (keyword: string) => {
    try {
      setIsLoading(true);
      setKeyword(keyword);
      const res = await concertClient.searchConcerts({
        ...filters,
        userId: userAuth?._id || '',
        keyword: keyword,
        startDate: new Date().toDateString(),
      }, userAuth.token);
      setConcerts(res);
      setIsLoading(false);
    } catch (err: any) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchConcerts();
  }, []);

  useEffect(() => {
    if (filters) {
      searchConcerts(keyword);
    }
  }, [filters]);

  return (
      <div className="container py-3">
        <h1>Upcoming Concerts</h1>
        <div className="my-4 row align-items-center">
          <div className="col-lg-8">
            <SearchBar searchFunction={searchConcerts} placeholder="Filter by keyword"/>
          </div>
          <div className="col-lg-4 my-lg-0 mt-2">
            <Button variant={filters?.following ? "light" : "dark"}
                    onClick={() => setFilters({...filters, following: !filters?.following})}
                    className="me-4">Following</Button>
            <Button variant={filters?.saved ? "light" : "dark"}
                    onClick={() => setFilters({...filters, saved: !filters?.saved})}>Saved</Button>
          </div>
        </div>
        <div>
          {isLoading && <div className="text-center">
            <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
          </div>}
          {!isLoading && concerts && <SimpleDisplay concerts={concerts}/>}
          {error && <ErrorModal error={error}/>}
        </div>
      </div>
  );
}