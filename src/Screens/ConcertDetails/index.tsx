import {useNavigate, useParams} from "react-router";
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
import {User} from "../../Clients/Schemas/users";
import {Badge} from "react-bootstrap";
import {stringToColor} from "../../Clients/utils";


export default function ConcertDetailsScreen() {
  const {concertId} = useParams();
  const [concert, setConcert] = useState<Concert>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<Error>();
  const [isFollowers, setIsFollowers] = useState(false);

  const navigate = useNavigate();
  const userAuth = useSelector((state: UserAuthState) => state.userAuthReducer.userAuth);

  const fetchConcert = async () => {
    try {
      setIsLoading(true);
      if (concertId) {
        // Load concert from database
        const savedConcert: Concert = await concertClient.getConcertById(concertId);
        if (savedConcert) {
          setConcert({...savedConcert, startDate: new Date(savedConcert.startDate)});
          setIsSaved(userAuth && savedConcert.attendingUsers.map(u => u._id).includes(userAuth._id));
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
        const c = await userClient.saveConcert(userAuth._id, concert!._id, userAuth.token);
        setConcert({...concert!, attendingUsers: c.attendingUsers});
      } else {
        const c = await userClient.unsaveConcert(userAuth._id, concert!._id, userAuth.token);
        setConcert({...concert!, attendingUsers: c.attendingUsers});
      }
      setIsSaved(!isSaved);
    } catch (err: any) {
      setError(err);
    }
  }

  const handleFollowersToggle = () => {
    setIsFollowers(!isFollowers);
  }

  const getAttendingUsersByToggle = (attendingUsers: User[]) => {
    return isFollowers ? attendingUsers.filter(u => u.followers.includes(userAuth._id)) : attendingUsers;
  }

  return (
      <div className="container pb-5">
        {isLoading && <div className="text-center">
          <div className="spinner-border mt-4" role="status" aria-hidden="true"></div>
        </div>}
        {!isLoading && concert &&
            <div>
              <div className="d-flex my-4 justify-content-between flex-wrap">
                <div className="card col-xxl-7 col-12 bg-black rounded-4 concert-info-card">
                  <img src={concert.image} className="card-img-top rounded-top-4 concert-top"
                       style={{objectFit: "cover"}} alt={concert.title}/>
                  <div className="card-img-overlay align-content-end p-0 concert-top">
                    <div className="bg-black bg-opacity-50 py-2 p-4">
                      <h1 className="card-title text-wrap text-white">{concert.title}</h1>
                    </div>
                  </div>
                  <div className="card-body p-4 z-3">
                    <div className="d-flex mb-4 flex-wrap">
                      {concert.tags && concert.tags.map(tag => (
                          <Badge className="me-2" bg="dark"
                                 style={{color: stringToColor(tag)}}>{tag}</Badge>
                      ))}
                    </div>
                    <ul className="list-group list-group-flush list-unstyled">
                      <li className="card-text list-group-item concert-info-list-item rounded bg-dark">
                        <div className="d-flex align-items-center">
                          <FaCalendarDays className="me-3 concert-icon text-accent"/>
                          {concert.startDate.toDateString()} &#8226; {concert.startDate.toLocaleTimeString().split(":")[0]}:
                          {concert.startDate.toLocaleTimeString().split(":")[1]} PM
                        </div>
                      </li>
                      <li className="card-text text-nowrap text-truncate list-group-item concert-info-list-item rounded my-2 bg-dark">
                        <div className="d-flex align-items-center flex-wrap">
                          <FaBuilding className="me-3 concert-icon text-accent"/>
                          {concert.venue.name}
                        </div>
                      </li>
                      <li className="card-text text-nowrap text-truncate list-group-item concert-info-list-item rounded bg-dark">
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
                <div className="column-gap-2"></div>
                <div className="col-xxl-4 col-12 p-4 bg-black rounded-4 mt-xxl-0 mt-4">
                  <h5 className="mb-3">Lineup</h5>
                  <SimpleList listItems={concert.artists}/>
                </div>
              </div>
              <div className="col-12 p-4 bg-black rounded-4 my-4 m-auto">
                <div className="d-flex justify-content-between">
                  <h5 className="mb-3">Attending
                    Users &#8226; {getAttendingUsersByToggle(concert.attendingUsers).length}</h5>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch"
                           id="simpleSwitch"
                           checked={isFollowers} onChange={handleFollowersToggle}/>
                    <label className="form-check-label"
                           form="simpleSwitch">{isFollowers ? "Followers" : "All Users"}</label>
                  </div>
                </div>
                <SimpleList clickable
                            listItems={getAttendingUsersByToggle(concert.attendingUsers).map((u: any) => ({
                              name: '@' + u.username,
                              image: u.profilePicture,
                              onClick: () => navigate(`/Profile/${u._id}`)
                            }))}/>
              </div>
            </div>
        }
        {error && <ErrorModal error={error}/>}
      </div>
  );
}