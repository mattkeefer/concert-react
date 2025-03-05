import {useState} from "react";
import "../index.css";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import * as userClient from "../../../Clients/userClient";
import {setUserAuth} from "../../../Store/userAuthReducer";
import ErrorAlert from "../../../Components/Alerts/ErrorAlert";

export default function Register() {
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<Error>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const errorMessage = "Account information is missing or incomplete. Please fix and try again.";

  const register = async () => {
    try {
      const auth = await userClient.registerUser(credentials);
      dispatch(setUserAuth({_id: auth.user._id, token: auth.token}));
      navigate("/Home");
    } catch (err: any) {
      setError(err);
    }
  }

  return (
      <>
        {error && <div className="container my-4 col-md-6">
          <ErrorAlert message={errorMessage}/>
        </div>}
        <div className="container bg-black my-4 rounded-4 p-4 text-black-50 col-md-6">
          <h3 className="text-white">Create Account</h3>
          <div className="row my-4">
            <div className="col-lg my-lg-0 mb-4">
              <div className="form-floating">
                <input type="text" className="form-control" id="firstName" placeholder="First Name"
                       value={credentials.firstName} onChange={(e) => setCredentials({
                  ...credentials,
                  firstName: e.target.value
                })}/>
                <label form="firstName">First Name</label>
              </div>
            </div>
            <div className="col-lg">
              <div className="form-floating">
                <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                       value={credentials.lastName} onChange={(e) => setCredentials({
                  ...credentials,
                  lastName: e.target.value
                })}/>
                <label form="lastName">Last Name</label>
              </div>
            </div>
          </div>
          <div className="row">
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
          <div className="row my-4">
            <div className="col">
              <div className="form-floating">
                <input type="text" className="form-control" id="username" placeholder="Username"
                       value={credentials.username} onChange={(e) => setCredentials({
                  ...credentials,
                  username: e.target.value
                })}/>
                <label form="username">Username</label>
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
                      onClick={register}
                      type="submit">
                Create Account
              </button>
            </div>
          </div>
          <p className="text-white-50 mt-4 small">Already have an account? <Link
              className="link-accent" to="/Login">Login</Link></p>
        </div>
      </>
  )
}