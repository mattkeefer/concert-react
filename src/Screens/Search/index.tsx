import {useState} from "react";
import * as concertClient from "../../Clients/concertClient";
import {Concert} from "../../Clients/Schemas/concerts";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SearchBar from "../../Components/SearchBar";
import SimpleDisplay from "../../Components/Displays/SimpleDisplay";

export default function Search() {

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Concert[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState<Error>();

  const searchDiscoveryConcerts = async (searchTerm: string) => {
    try {
      setIsSearched(false);
      setIsLoading(true);
      setSearchResults([]);
      const results = await concertClient.searchDiscoveryConcerts({
        keyword: searchTerm,
      });
      setSearchResults(results);
      setIsLoading(false);
      setIsSearched(true);
    } catch (err: any) {
      setError(err);
    }
  }

  return (
      <div className="container py-3">
        <div className="my-4">
          <SearchBar searchFunction={searchDiscoveryConcerts} padded={true}/>
        </div>
        {error && <ErrorModal error={error}/>}
        {isLoading && <div className="text-center">
          <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
        </div>}
        {isSearched && <div>
          {searchResults.length > 0 ?
          <SimpleDisplay concerts={searchResults}/> :
          <div>No results found</div>}
        </div>}
      </div>
  );
}