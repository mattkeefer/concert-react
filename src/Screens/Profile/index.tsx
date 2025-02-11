import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {UserState} from "../../Store";
import * as userClient from "../../Clients/userClient";
import {useEffect, useState} from "react";
import {FaCheck, FaPlus, FaUser} from "react-icons/fa";
import "./index.css";
import {Concert} from "../../Clients/Schemas/concerts";
import {User} from "../../Clients/Schemas/users";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SimpleDisplay from "../../Components/Displays/SimpleDisplay";

export default function Profile() {
  const {userId} = useParams();
  const user = useSelector((state: UserState) => state.userReducer.user);
  const [profile, setProfile] = useState<User>();
  const [upcomingConcerts, setUpcomingConcerts] = useState<Concert[]>();
  const [pastConcerts, setPastConcerts] = useState<Concert[]>();
  const [error, setError] = useState<Error>();

  const fetchProfile = async () => {
    try {
      const u = await userClient.profile(userId as string);
      setProfile(u);
      const c = await userClient.getSavedConcertsForUserById(user._id);
      const past = c.filter((concert: Concert) => new Date(concert.startDate) < new Date());
      setPastConcerts(past);
      const upcoming = c.filter((concert: Concert) => new Date(concert.startDate) >= new Date());
      setUpcomingConcerts(upcoming);
    } catch (err: any) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const followUser = async () => {
    try {
      await userClient.followUser(user._id, userId!);
      fetchProfile();
    } catch (err: any) {
      setError(err);
    }
  }

  const unfollowUser = async () => {
    try {
      await userClient.unfollowUser(user._id, userId!);
      fetchProfile();
    } catch (err: any) {
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
              <h4>Upcoming Concerts</h4>
              {upcomingConcerts && upcomingConcerts.length > 0 ?
                  <SimpleDisplay concerts={upcomingConcerts}/> :
                  <div>
                    <h6 className="text-dark-emphasis">No concerts yet...</h6>
                  </div>}
            </div>
            <div className="col-12 mb-4">
              <h4>Past Concerts</h4>
              {pastConcerts && pastConcerts.length > 0 ?
                  <SimpleDisplay concerts={pastConcerts}/> :
                  <div>
                    <h6 className="text-dark-emphasis">No concerts yet...</h6>
                  </div>}
            </div>
          </div>
        </div>}
        {error && <ErrorModal error={error}/>}
      </div>
  );
}
