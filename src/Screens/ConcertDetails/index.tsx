import {useParams} from "react-router";
import {UserAuthState} from "../../Store";
import {useSelector} from "react-redux";
import * as concertClient from "../../Clients/concertClient";
import * as userClient from "../../Clients/userClient";
import {useEffect, useState} from "react";
import "./index.css";
import {FaLocationDot, FaCalendarDays, FaBuilding} from "react-icons/fa6";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {Concert} from "../../Clients/Schemas/concerts";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SimpleList from "../../Components/Lists/SimpleList";


export default function ConcertDetailsScreen() {
  const {concertId} = useParams();
  const [concert, setConcert] = useState<Concert>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<Error>();

  const userAuth = useSelector((state: UserAuthState) => state.userAuthReducer.userAuth);

  const fetchConcert = async () => {
    try {
      setIsLoading(true);
      if (concertId) {
        // Load concert from database
        const savedConcert: Concert = await concertClient.getConcertById(concertId);
        if (savedConcert) {
          setConcert({...savedConcert, startDate: new Date(savedConcert.startDate)});
          setIsSaved(userAuth && savedConcert.attendingUsers.includes(userAuth._id));
        }
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchConcert();
  }, []);

  const saveConcert = async () => {
    try {
      if (!isSaved) {
        await userClient.saveConcert(userAuth._id, concert!._id, userAuth.token);
      } else {
        await userClient.unsaveConcert(userAuth._id, concert!._id, userAuth.token);
      }
      setIsSaved(!isSaved);
    } catch (err: any) {
      setError(err);
    }
  }

  return (
      <div className="container pb-5">
        {isLoading && <div className="text-center">
          <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
        </div>}
        {!isLoading && concert &&
            <div className="d-flex my-4 justify-content-center flex-wrap">
              <div className="card col-lg-7 col-12 bg-black rounded-4 me-lg-2 concert-info-card">
                <img src={concert.image} className="card-img-top rounded-top-4 concert-top"
                     style={{objectFit: "cover"}} alt={concert.title}/>
                <div className="card-img-overlay align-content-end p-0 concert-top">
                  <div className="bg-black bg-opacity-50 py-2 p-4">
                    <h1 className="card-title text-nowrap text-truncate text-white">{concert.title}</h1>
                  </div>
                </div>
                <div className="card-body p-4 z-3">
                  <ul className="list-group list-group-flush list-unstyled">
                    <li className="card-text list-group-item concert-info-list-item rounded">
                      <div className="d-flex align-items-center">
                        <FaCalendarDays className="me-3 concert-icon text-accent"/>
                        {concert.startDate.toDateString()} &#8226; {concert.startDate.toLocaleTimeString().split(":")[0]}:
                        {concert.startDate.toLocaleTimeString().split(":")[1]} PM
                      </div>
                    </li>
                    <li className="card-text text-nowrap text-truncate list-group-item concert-info-list-item rounded my-2">
                      <div className="d-flex align-items-center flex-wrap">
                        <FaBuilding className="me-3 concert-icon text-accent"/>
                        {concert.venue.name}
                      </div>
                    </li>
                    <li className="card-text text-nowrap text-truncate list-group-item concert-info-list-item rounded">
                      <div className="d-flex align-items-center flex-wrap">
                        <FaLocationDot className="me-3 concert-icon text-accent"/>
                        {concert.venue.city}, {concert.venue.country}
                      </div>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-around">
                    <button
                        className={"btn btn-dark my-4 d-flex align-items-center"}
                        type="button"
                        onClick={() => saveConcert()}>
                      {!isSaved ? <FaRegHeart className="me-2 text-accent"/> :
                          <FaHeart className="me-2 text-accent"/>}
                      {!isSaved ? "Save Concert" : "Saved Concert"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12 p-4 bg-black rounded-4 ms-lg-2 my-lg-0 my-4">
                <h5 className="mb-3">Lineup</h5>
                <SimpleList listItems={concert.artists}/>
              </div>
            </div>
        }
        {error && <ErrorModal error={error}/>}
      </div>
  );
}