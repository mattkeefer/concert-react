import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {UserState} from "../../Store";
import * as userClient from "../../Clients/userClient";
import {useEffect, useState} from "react";
import "./index.css";
import {Concert} from "../../Clients/Schemas/concerts";
import {User} from "../../Clients/Schemas/users";
import ErrorModal from "../../Components/Modals/ErrorModal";
import SimpleDisplay from "../../Components/Displays/SimpleDisplay";
import ProfileTopper from "./ProfileTopper";

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
      const c = await userClient.getSavedConcertsForUserById(userId as string);
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
      setError(err);
    }
  }

  return (
      <div className="container py-4">
        {profile && <div>
          <ProfileTopper user={user} userId={userId} profile={profile} followUser={followUser}
                     unfollowUser={unfollowUser}/>
          <div className="d-flex flex-wrap bg-black rounded-4 p-4">
            <div className="col-12 mb-4">
              <h4>Upcoming Concerts &#8226; {upcomingConcerts?.length}</h4>
              {upcomingConcerts && upcomingConcerts.length > 0 ?
                  <SimpleDisplay concerts={upcomingConcerts}/> :
                  <div>
                    <h6 className="text-dark-emphasis">No concerts yet...</h6>
                  </div>}
            </div>
            <div className="col-12 mb-4">
              <h4>Past Concerts &#8226; {pastConcerts?.length}</h4>
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
