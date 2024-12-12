import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {UserState} from "../Store";
import * as userClient from "../Users/client";
import * as concertClient from "../Concert/client";
import * as connectClient from "../Connect/client";
import {useEffect, useState} from "react";
import {FaCheck, FaPlus, FaUser} from "react-icons/fa"
import "./index.css"
import ConcertCard from "../Concert/Card";
import {parseConcertFromEvent} from "../Concert/client";

export default function Profile() {
  const {userId} = useParams();
  const user = useSelector((state: UserState) => state.userReducer.user);
  const [profile, setProfile] = useState<userClient.user>({
    _id: "",
    attending: [],
    email: "",
    firstName: "",
    followers: [],
    following: [],
    interested: [],
    lastName: "",
    password: "",
    role: "",
    username: ""
  });
  const [interested, setInterested] = useState<concertClient.Event[]>();
  const [attending, setAttending] = useState<concertClient.Event[]>();

  const fetchProfile = async () => {
    const u = await userClient.profile(userId as string);
    setProfile(u);
    const promises = [u.interested, u.attending];
    const [ints, atts] = await Promise.all(promises.map(p => concertClient.getConcertsByIds(p)));
    setInterested(ints);
    setAttending(atts);
  }

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const followUser = async () => {
    try {
      const res = await connectClient.followUser(userId);
      setProfile(res);
    } catch (error) {
      console.log(error);
    }
  }

  const unfollowUser = async () => {
    try {
      const res = await connectClient.unfollowUser(userId);
      setProfile(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
      <div className="container py-3">
        {profile && <div>
          <div className="d-flex mt-4 mb-3 justify-content-center flex-wrap bg-black rounded-4">
            <div className="col-4 text-center d-flex justify-content-center align-items-center">
              <div
                  className="bg-dark profile-img-container my-4 d-flex align-items-center justify-content-center">
                <FaUser className="profile-img-icon"/>
              </div>
            </div>
            <div className="col-8 p-4 d-flex align-items-center">
              <div>
                <h5 className="text-accent">@{profile.username}</h5>
                <h1>{profile.firstName} {profile.lastName}</h1>
                <h5>{profile.attending.length} concerts attending <span
                    className="text-dark-emphasis">|</span> {profile.followers.length} followers <span
                    className="text-dark-emphasis">|</span> {profile.following.length} following
                </h5>
                {user._id !== userId && <div>
                  {profile.followers.includes(user._id) ?
                      <button className="btn btn-dark mt-3 d-flex align-items-center"
                              type="button"
                              onClick={() => unfollowUser()}>
                        <FaCheck className="me-2 text-accent"/> Following
                      </button> :
                      <button className="btn btn-dark mt-3 d-flex align-items-center"
                              type="button"
                              onClick={() => followUser()}>
                        <FaPlus className="me-2 text-black-50"/> Follow
                      </button>}
                </div>}
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap bg-black rounded-4 p-4">
            <div className="col-12 mb-4">
              <h4>Attending</h4>
              {attending && attending.length > 0 ? <div className="card-group">
                    <ul className="list-group list-group-horizontal">
                      {attending.map((event, i) => (
                              <li key={'att' + i}>
                                <ConcertCard cardDetails={parseConcertFromEvent(event)}/>
                              </li>
                          )
                      )}
                    </ul>
                  </div> :
                  <div>
                    <h6 className="text-dark-emphasis">No concerts yet...</h6>
                  </div>}
            </div>
            <div className="col-12">
              <h4>Interested</h4>

              {interested && interested.length > 0 ? <div className="card-group">
                    <ul className="list-group list-group-horizontal">
                      {interested.map((event, i) => (
                              <li key={'att' + i}>
                                <ConcertCard cardDetails={parseConcertFromEvent(event)}/>
                              </li>
                          )
                      )}
                    </ul>
                  </div> :
                  <div>
                    <h6 className="text-dark-emphasis">No concerts yet...</h6>
                  </div>}
            </div>
          </div>
        </div>}
      </div>
  );
}
