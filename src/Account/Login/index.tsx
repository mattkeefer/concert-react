import {useState} from "react";
import * as userClient from "../../Users/client";
import "../index.css";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {setUser} from "../../Users/reducer";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const newUser: any = await userClient.loginUser(credentials);
      dispatch(setUser(newUser));
      navigate("/Home");
      setError("");
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        setError("Username or password is incorrect")
      } else {
        setError(error.response.data);
      }
    }
  };

  return (
      <div className="container bg-black my-4 rounded-4 p-4 text-black-50 col-md-6">
        <h3 className="text-white">Login</h3>
        {error && <p className="text-danger">{error}</p>}
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
                    onClick={login}
                    type="submit">
              Login
            </button>
          </div>
        </div>
        <p className="text-white-50 mt-4 small">Need to create an account? <Link
            className="link-accent" to="/Register">Register</Link></p>
      </div>
  )
}