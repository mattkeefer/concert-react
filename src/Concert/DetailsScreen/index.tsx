import {useParams} from "react-router";
import {UserState} from "../../Store";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../../Users/reducer";
import * as jambaseClient from "../Jambase/client";
import * as concertClient from "../client";
import * as connectClient from "../../Connect/client";
import {useEffect, useState} from "react";
import "./index.css";
import {FaLocationDot, FaCalendarDays, FaBuilding} from "react-icons/fa6";
import {FaPlus, FaCheck} from "react-icons/fa";


export default function ConcertDetailsScreen() {
  const {source, eventId} = useParams();
  const [simpleConcert, setSimpleConcert] =
      useState<concertClient.SimpleConcert>();
  const [event, setEvent] = useState<concertClient.Event>();
  const [concert, setConcert] = useState<concertClient.Event>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  const user = useSelector((state: UserState) => state.userReducer.user);
  const dispatch = useDispatch();


  const fetchConcert = async () => {
    setIsLoading(true);

    // Load event from jambase api
    const res = await jambaseClient.getConcert(source, eventId);
    const event = res.event;
    setEvent(event);

    // Parse jambase event for ease of use
    setSimpleConcert(concertClient.parseConcertFromEvent(event));

    // Load concert from database
    const savedConcert = await concertClient.getConcert(source, eventId);
    // If concert exists in the database
    if (savedConcert) {
      setConcert(savedConcert);
      setIsInterested(user.interested.includes(savedConcert._id));
      setIsAttending(!isInterested && user.attending.includes(savedConcert._id));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchConcert();
  }, []);

  const attendConcert = async () => {
    console.log('ATTEND CONCERT');
    try {
      // Attend concert, save to database
      const savedConcert = await connectClient.attendConcert(event);
      setConcert(savedConcert);
      // Add concert to user store
      const attCopy = [...user.attending];
      attCopy.push(savedConcert._id);
      dispatch(setUser({...user, attending: attCopy}));
      // Display attending
      setIsAttending(true);
      // If user is interested in concert, we want to remove interest as we attend
      if (isInterested) {
        uninterestConcert()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const interestConcert = async () => {
    console.log('INTEREST CONCERT');
    try {
      // Interest concert, save to database
      const savedConcert = await connectClient.interestConcert(event);
      setConcert(savedConcert);
      // Add concert to user store
      const intCopy = [...user.interested];
      intCopy.push(savedConcert._id);
      dispatch(setUser({...user, interested: intCopy}));
      // Display interested
      setIsInterested(true);
      // If user is attending concert, we want to remove attending as we interest
      if (isAttending) {
        unattendConcert();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const unattendConcert = async () => {
    console.log('UNATTEND CONCERT');
    try {
      // Unattend concert
      const savedConcert = await connectClient.removeAttending(event?.identifier);
      setConcert(savedConcert);
      // Remove concert from user store
      const attCopy = [...user.attending];
      dispatch(setUser({...user, attending: attCopy.filter(cid => cid !== concert?._id)}));
      // Display not attending
      setIsAttending(false);
    } catch (error) {
      console.log(error);
    }
  }

  const uninterestConcert = async () => {
    console.log('UNINTEREST CONCERT');
    try {
      // Uninterest concert
      const savedConcert = await connectClient.removeInterest(event?.identifier);
      setConcert(savedConcert);
      // Remove concert from user store
      const intCopy = [...user.interested];
      dispatch(setUser({...user, interested: intCopy.filter(cid => cid !== concert?._id)}));
      // Display not interested
      setIsInterested(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
      <div className="container pb-5">
        {isLoading && <div className="text-center">
          <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
        </div>}
        {!isLoading && simpleConcert &&
            <div className="d-flex my-4 justify-content-center flex-wrap">
              <div className="card col-lg-7 col-12 bg-black rounded-4 me-lg-2 concert-info-card">
                <img src={simpleConcert.image} className="card-img-top rounded-top-4 concert-top"
                     style={{objectFit: "cover"}} alt={simpleConcert.title}/>
                <div className="card-img-overlay align-content-end p-0 concert-top">
                  <div className="bg-black bg-opacity-50 py-2 p-4">
                    <h1 className="card-title text-nowrap text-truncate text-white">{simpleConcert.title}</h1>
                  </div>
                </div>
                <div className="card-body p-4 z-3">
                  <ul className="list-group list-group-flush list-unstyled">
                    <li className="card-text list-group-item concert-info-list-item rounded">
                      <div className="d-flex align-items-center">
                        <FaCalendarDays className="me-3 concert-icon text-accent"/>
                        {simpleConcert.date.toDateString()} &#8226; {simpleConcert.date.toLocaleTimeString().split(":")[0]}:
                        {simpleConcert.date.toLocaleTimeString().split(":")[1]} PM
                      </div>
                    </li>
                    <li className="card-text text-nowrap text-truncate list-group-item concert-info-list-item rounded my-2">
                      <div className="d-flex align-items-center flex-wrap">
                        <FaBuilding className="me-3 concert-icon text-accent"/>
                        {simpleConcert.venue}
                      </div>
                    </li>
                    <li className="card-text text-nowrap text-truncate list-group-item concert-info-list-item rounded">
                      <div className="d-flex align-items-center flex-wrap">
                        <FaLocationDot className="me-3 concert-icon text-accent"/>
                        {simpleConcert.city}
                      </div>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-around">
                    <button
                        className={"btn btn-dark my-4 d-flex align-items-center"}
                        type="button"
                        onClick={() => isInterested ? uninterestConcert() : interestConcert()}>
                      {!isInterested ? <FaPlus className="me-2 text-black-50"/> :
                          <FaCheck className="me-2 text-accent"/>}
                      Interested
                    </button>
                    <button
                        className={"btn btn-dark my-4 d-flex align-items-center"}
                        type="button"
                        onClick={() => isAttending ? unattendConcert() : attendConcert()}>
                      {!isAttending ? <FaPlus className="me-2 text-black-50"/> :
                          <FaCheck className="me-2 text-accent"/>}
                      Attending
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12 p-4 bg-black rounded-4 ms-lg-2 my-lg-0 my-4">
                <h5 className="mb-3">Lineup</h5>
                <ul className="list-group list-group-flush list-unstyled">
                  {simpleConcert.artists.map((a, i) => <li
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