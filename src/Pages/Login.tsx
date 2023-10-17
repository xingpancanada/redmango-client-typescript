import React, { useState } from 'react'
import { inputHelper } from '../Helper';
import { useLoginUserMutation } from '../Apis/authApi';
import { apiResponse, userModel } from '../Interfaces';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [loginUserMutation] = useLoginUserMutation();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response: apiResponse = await loginUserMutation({
      userName: userInput.userName,
      password: userInput.password
    });
    //console.log("login reponse: ", response);

    if (response.data) {
      //console.log("login reponse data: ", response.data);
      const token = response.data.result.token;
      localStorage.setItem("redmangousertoken", response.data.result.token);

      const { firstName, id, email, role }: userModel = jwt_decode(token);
      dispatch(setLoggedInUser({ firstName, id, email, role }));

      navigate("/");
    }
    if (response.error) {
      //console.log("login error reponse data: ", response.error.data.errorMessages[0]);
      setError(response.error.data.errorMessages[0]);
    }

    setLoading(false);
  }

  return (
    <div className="container text-center">
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
            />
          </div>

          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4 mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
        </div>

        <div className="mt-2">
          {error && <p className='text-danger' style={{ fontSize: '0.6rem' }}>{error}</p>}
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: "200px" }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login