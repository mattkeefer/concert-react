import {useState} from "react";
import * as userClient from "../../../Clients/userClient";
import "../index.css";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {setUser} from "../../../Store/userReducer";
import {User} from "../../../Clients/Schemas/users";
import ErrorAlert from "../../../Components/ErrorAlert";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Error>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const newUser: User = await userClient.loginUser(credentials);
      dispatch(setUser(newUser));
      navigate("/Home");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
      <>
        {error && <div className="container my-4 col-md-6">
          <ErrorAlert message="Login details are incorrect. Please fix and try again."/>
        </div>}
        <div className="container bg-black my-4 rounded-4 p-4 text-black-50 col-md-6">
          <h3 className="text-white">Login</h3>
          <div className="row my-4">
            <div className="col">
              <div className="form-floating">
                <input type="email" className="form-control" id="email" placeholder="Email"
                       value={credentials.email} onChange={(e) => setCredentials({
                  ...credentials,
                  email: e.target.value
                })}/>
                <label form="email">Email</label>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Password"
                       value={credentials.password} onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}/>
                <label form="password">Password</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="d-flex">
              <button className="btn btn-danger btn-accent flex-grow-1 py-2"
                      onClick={login}
                      type="submit">
                Login
              </button>
            </div>
          </div>
          <p className="text-white-50 mt-4 small">Need to create an account? <Link
              className="link-accent" to="/Register">Register</Link></p>
        </div>
      </>
  )
}