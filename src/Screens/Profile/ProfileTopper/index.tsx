import {User} from "../../../Clients/Schemas/users";
import {FaCheck, FaPlus, FaUser} from "react-icons/fa";
import "./index.css";
import {useState} from "react";
import BaseModal from "../../../Components/Modals/BaseModal";

export default function ProfileTopper({user, userId, profile, followUser, unfollowUser}: {
  user: User,
  userId: any,
  profile: User,
  followUser: () => void,
  unfollowUser: () => void
}) {
  const [show, setShow] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("");
  const [displayUsers, setDisplayUsers] = useState<string[]>([]);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = (userIds: string[], title: string) => {
    setDisplayUsers(userIds);
    setDisplayTitle(title);
    setShow(true);
  }

  return (
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
            <div className="d-flex">
              <h5>{profile.savedConcerts.length} saved concerts</h5>
              <h5 className="text-dark-emphasis mx-2">|</h5>
              <a className="link-light" onClick={() => handleShow(profile.followers, 'Followers')}>
                <h5>{profile.followers.length} followers</h5>
              </a>
              <h5 className="text-dark-emphasis mx-2">|</h5>
              <a className="link-light" onClick={() => handleShow(profile.following, 'Following')}>
                <h5>{profile.following.length} following</h5>
              </a>
            </div>
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
        {show && <BaseModal title={displayTitle} titleColor="text-accent"
                            message={displayUsers.length > 0 ? displayUsers.join('\n') : 'No one yet...'}
                            closeButton={true} onHide={handleClose}/>}
      </div>
  );
}