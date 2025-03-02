import {useState} from "react";
import * as concertClient from "../../Clients/concertClient";
import * as userClient from "../../Clients/userClient";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SearchBar from "../../Components/SearchBar";
import SimpleDisplay from "../../Components/Displays/SimpleDisplay";
import SimpleList from "../../Components/Lists/SimpleList";
import {User} from "../../Clients/Schemas/users";
import {useNavigate} from "react-router";

export default function Search() {

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState<Error>();
  const [isConcertSearch, setIsConcertSearch] = useState(true);

  const navigate = useNavigate();

  const handleSearch = async (searchTerm: string) => {
    try {
      setIsSearched(false);
      setIsLoading(true);
      setSearchResults([]);
      const results = isConcertSearch ? await searchDiscoveryConcerts(searchTerm) : await searchUsers(searchTerm);
      setSearchResults(results);
      setIsLoading(false);
      setIsSearched(true);
    } catch (err: any) {
      setError(err);
    }
  }

  const searchDiscoveryConcerts = async (searchTerm: string) => {
    return await concertClient.searchDiscoveryConcerts({
      keyword: searchTerm,
    });
  }

  const searchUsers = async (searchTerm: string) => {
    const res = await userClient.getUsersByQuery({username: searchTerm});
    const formattedList = res.map((u: User) => ({name: "@" + u.username, image: u.profilePicture, onClick: () => navigate(`/Profile/${u._id}`)}))
    console.log(formattedList);
    return formattedList;
  }

  const handleSearchTypeToggle = () => {
    setIsConcertSearch(!isConcertSearch);
    setIsSearched(false);
    setSearchResults([]);
  }

  return (
      <div className="container py-3">
        <div className="my-4">
          <SearchBar searchFunction={handleSearch} padded={true} placeholder={isConcertSearch ? "Keyword" : "Username"}/>
          <div className="form-check form-switch my-2">
            <input className="form-check-input" type="checkbox" role="switch" id="simpleSwitch"
                   checked={isConcertSearch} onChange={handleSearchTypeToggle}/>
            <label className="form-check-label"
                   form="simpleSwitch">{isConcertSearch ? "Concerts" : "Users"}</label>
          </div>
        </div>
        {error && <ErrorModal error={error}/>}
        {isLoading && <div className="text-center">
          <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
        </div>}
        {isSearched && isConcertSearch && <div>
          {searchResults.length > 0 ?
              <SimpleDisplay concerts={searchResults}/> :
              <div>No results found...</div>}
        </div>}
        {isSearched && !isConcertSearch && <div className="col-4">
          {searchResults.length > 0 ?
              <SimpleList listItems={searchResults} className={"bg-dark"} clickable/> :
              <div>No results found...</div>}
        </div>}
      </div>
  );
}