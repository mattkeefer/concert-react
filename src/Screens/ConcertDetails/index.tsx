import {useParams} from "react-router";
import {UserState} from "../../Store";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../../Clients/userReducer";
import * as concertClient from "../../Clients/concertClient";
import {useEffect, useState} from "react";
import "./index.css";
import {FaLocationDot, FaCalendarDays, FaBuilding} from "react-icons/fa6";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {Concert} from "../../Clients/concertClient";


export default function ConcertDetailsScreen() {
  const {concertId} = useParams();
  const [concert, setConcert] = useState<Concert>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const user = useSelector((state: UserState) => state.userReducer.user);
  const dispatch = useDispatch();


  const fetchConcert = async () => {
    setIsLoading(true);
    if (concertId) {
      // Load concert from database
      const savedConcert: Concert = await concertClient.getConcertById(concertId);
      if (savedConcert) {
        setConcert({...savedConcert, startDate: new Date(savedConcert.startDate)});
        // setIsSaved(user.savedConcerts.includes(savedConcert._id));
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcert();
  }, []);

  const saveConcert = async () => {
    console.log('SAVE CONCERT');
    setIsSaved(!isSaved);
    // try {
    //   // Attend concert, save to database
    //   const savedConcert = await connectClient.attendConcert(event);
    //   setConcert(savedConcert);
    //   // Add concert to user store
    //   const attCopy = [...user.attending];
    //   attCopy.push(savedConcert._id);
    //   dispatch(setUser({...user, attending: attCopy}));
    //   // Display attending
    //   setIsAttending(true);
    //   // If user is interested in concert, we want to remove interest as we attend
    //   if (isInterested) {
    //     uninterestConcert()
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  const unsaveConcert = async () => {
    console.log('UNSAVE CONCERT');
    setIsSaved(!isSaved);
    // try {
    //   // Unattend concert
    //   const savedConcert = await connectClient.removeAttending(event?.identifier);
    //   setConcert(savedConcert);
    //   // Remove concert from user store
    //   const attCopy = [...user.attending];
    //   dispatch(setUser({...user, attending: attCopy.filter(cid => cid !== concert?._id)}));
    //   // Display not attending
    //   setIsAttending(false);
    // } catch (error) {
    //   console.log(error);
    // }
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
                        {concert.venue.city}
                      </div>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-around">
                    <button
                        className={"btn btn-dark my-4 d-flex align-items-center"}
                        type="button"
                        onClick={() => isSaved ? unsaveConcert() : saveConcert()}>
                      {!isSaved ? <FaRegHeart className="me-2 text-accent"/> :
                          <FaHeart className="me-2 text-accent"/>}
                      {!isSaved ? "Save Concert" : "Saved Concert"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12 p-4 bg-black rounded-4 ms-lg-2 my-lg-0 my-4">
                <h5 className="mb-3">Lineup</h5>
                <ul className="list-group list-group-flush list-unstyled">
                  {concert.artists.map((a, i) => <li
                      className="list-group-item concert-info-list-item rounded mb-2"
                      key={a.name + i}>
                    <div className="rounded-5 d-flex justify-content-between align-items-center">
                      {a.name}
                      <img src={a.image} alt={a.name} className="rounded-5 concert-img-icon"/>
                    </div>
                  </li>)}
                </ul>
              </div>
            </div>
        }
      </div>
  );
}