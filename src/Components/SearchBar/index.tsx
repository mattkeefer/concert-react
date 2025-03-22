import {ChangeEvent, useState} from "react";
import {FaSearch} from "react-icons/fa";

export default function SearchBar({searchFunction, placeholder = "Keyword", padded = false}: {
  searchFunction: (term: string) => void,
  placeholder?: string,
  padded?: boolean,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!padded) {
      searchFunction(e.target.value);
    }
  }

  return (
      <div className="text-black-50">
        <div className="input-group">
          <input type="text" className={padded ? "form-control p-3" : "form-control p-2"}
                 id="searchTerm" placeholder={placeholder} pattern="[A-Za-z]"
                 value={searchTerm} onChange={searchTermChange}/>
          {padded &&
            <button
              className="btn btn-primary btn-accent align-middle p-3"
              onClick={() => searchFunction(searchTerm)}
              type="submit">
              <FaSearch/>
            </button>
          }
        </div>
      </div>

      // <div className="text-black-50">
      //   <div className="d-flex justify-content-end my-2 align-items-center">
      //     <div className="flex-grow-1 form-floating d-flex my-4">
      //       <input type="text" className="form-control" id="searchTerm" placeholder="Keyword"
      //              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      //       <label form="searchTerm">Keyword</label>
      //     </div>
      //     <button className="btn btn-danger btn-accent mx-2"
      //             onClick={() => searchFunction(searchTerm)}
      //             type="submit">
      //       Search
      //     </button>
      //   </div>
      // </div>
  );
}