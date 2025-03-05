import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "./index.css";
import {UserAuthState} from "../../Store";
import {useDispatch, useSelector} from "react-redux";
import * as client from "../../Clients/userClient";
import {resetUserAuth} from "../../Store/userAuthReducer";

export default function Navigation() {
  const userAuth = useSelector((state: UserAuthState) => state.userAuthReducer.userAuth);
  const {pathname} = useLocation();
  const [currUserAuth, setCurrUserAuth] = useState(userAuth);
  const [path, setPath] = useState(pathname);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrUserAuth(userAuth);
  }, [userAuth]);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  const secureLinks = [
    {label: 'Home', location: '/Home'},
    {label: 'Search', location: '/Search'},
    {label: 'Profile', location: `/Profile/${currUserAuth._id}`},
  ];

  const unsecureLinks = [
    {label: 'Home', location: '/Home'},
    {label: 'Search', location: '/Search'},
  ];

  const logout = async () => {
    dispatch(resetUserAuth());
    navigate("/");
  }

  const login = () => {
    navigate("/Login");
  }

  return (
      <nav className="navbar navbar-expand navbar-dark bg-black">

        <div className="col-4">
          <img src="logo.png" className="ms-4 nav-logo" alt="Concert Connect logo"/>
        </div>
        <div className="col-4">
          <ul className="navbar-nav justify-content-center">
            {currUserAuth._id !== null ? secureLinks.map((link, i) => (
                <li key={link.label} className="nav-item">
                  <Link
                      className={path.includes(link.label) ? "font-weight-bold nav-link active" : "nav-link"}
                      to={link.location}>{link.label}</Link>
                </li>
            )) : unsecureLinks.map((link, i) => (
                <li key={link.label}
                    className="nav-item">
                  <Link
                      className={path.includes(link.label) ? "font-weight-bold nav-link active" : "nav-link"}
                      to={link.location}>{link.label}</Link>
                </li>
            ))}
          </ul>
        </div>
        <div className="col-4 text-end">
          {currUserAuth._id !== null ?
              <button className="btn btn-dark me-4" onClick={logout}>Logout</button> :
              <button className="btn btn-dark me-4" onClick={login}>Login</button>}
        </div>
      </nav>
  );
}