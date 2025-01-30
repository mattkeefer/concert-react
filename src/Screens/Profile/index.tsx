import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {UserState} from "../../Store";
import * as userClient from "../../Clients/userClient";
import * as concertClient from "../../Clients/concertClient";
import {useEffect, useState} from "react";
import {FaCheck, FaPlus, FaUser} from "react-icons/fa"
import "./index.css"
import ConcertCard from "../../Components/Card";
import {Concert} from "../../Clients/Schemas/concerts";
import {User} from "../../Clients/Schemas/users";

export default function Profile() {
  const {userId} = useParams();
  const user = useSelector((state: UserState) => state.userReducer.user);
  const [profile, setProfile] = useState<User>();
  const [savedConcerts, setSavedConcerts] = useState<Concert[]>();

  const fetchProfile = async () => {
    const u = await userClient.profile(userId as string);
    console.log(u);
    setProfile(u);
  }

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const followUser = async () => {
    try {
      const res = await userClient.followUser(user._id, userId!);
      setProfile(res);
    } catch (error) {
      console.log(error);
    }
  }

  const unfollowUser = async () => {
    try {
      const res = await userClient.unfollowUser(user._id, userId!);
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
                <h5>{profile.savedConcerts.length} saved concerts <span
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
              <h4>Saved Concerts</h4>
              {savedConcerts && savedConcerts.length > 0 ? <div className="card-group">
                    <ul className="list-group list-group-horizontal">
                      {savedConcerts.map((concert, i) => (
                              <li key={'saved' + i}>
                                <ConcertCard concert={concert}/>
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
