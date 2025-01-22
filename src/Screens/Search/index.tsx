import ConcertCard from "../../Components/Card";
import {useState} from "react";
import "./index.css";
import * as concertClient from "../../Clients/concertClient";
import {Concert} from "../../Clients/Schemas/concerts";

export default function Search() {

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Concert[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const searchDiscoveryConcerts = async () => {
    setIsLoading(true);
    setIsSearched(true);
    const results = await concertClient.searchDiscoveryConcerts({
      keyword: searchTerm,
    });
    setSearchResults(results);
    setIsLoading(false);
  }

  return (
      <div className="container py-3">
        <h1>Search Concerts</h1>
        <div className="container bg-black my-4 rounded-4 p-4 text-black-50 col-md-10">
          <div className="d-flex justify-content-end my-2 align-items-center">
            <div className="flex-grow-1 form-floating d-flex my-4">
              <input type="text" className="form-control" id="searchTerm" placeholder="Keyword"
                     value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              <label form="searchTerm">Keyword</label>
            </div>
            <button className="btn btn-danger btn-accent mx-2"
                    onClick={searchDiscoveryConcerts}
                    type="submit">
              Search
            </button>
          </div>
        </div>
        {isSearched && <div>
          {isLoading && <div className="text-center">
            <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
          </div>}
          {searchResults.length > 0 ?
              <div className="d-flex justify-content-between flex-wrap">
                {searchResults.map((concert) => (
                    <ConcertCard concert={concert}/>
                ))}
              </div> :
              <div>No results found</div>}
        </div>}
      </div>
  );
}