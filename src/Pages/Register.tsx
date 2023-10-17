import React, { useState } from 'react'
import { SD_Roles } from '../Utility/SD'
import { inputHelper, toastNotify } from '../Helper';
import { useRegisterUserMutation } from '../Apis/authApi';
import { apiResponse } from '../Interfaces';
import { useNavigate } from 'react-router-dom';
import { MainLoader } from '../Components/Page/Common';

function Register() {
  const [registerUserMutation] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    firstName: ""
  });
  const navigate = useNavigate();

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);

  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: apiResponse = await registerUserMutation({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      firstName: userInput.firstName,
    });

    if (response.data) {
      //console.log("register reponse data: ", response.data);
      toastNotify("Registeration successful! Pleaselogin to continue.", 'success');
      navigate("/login");
    } else if (response.error) {
      //console.log("register error reponse data: ", response.error.data.errorMesssages[0]);
      toastNotify(response.error.data.errorMesssages[0], 'error');
    }

    setLoading(false);
  }


  return (
    <div className="container text-center">
      {loading ? (<MainLoader />) : (
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mt-5">Register</h1>
          <div className="mt-5">
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                value={userInput.userName}
                onChange={handleUserInput}
                name="userName"
                placeholder="Enter Username"
                required
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                value={userInput.firstName}
                onChange={handleUserInput}
                name="firstName"
                placeholder="Enter First Name"
                required
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="password"
                className="form-control"
                value={userInput.password}
                onChange={handleUserInput}
                name="password"
                placeholder="Enter Password"
                required
              />
              <p style={{ fontSize: '0.6rem', color: "red" }} className='text-start'>At least 8 characters and numbers, at least one uppercase, at least one number. </p>
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <select className="form-control form-select" required value={userInput.role} onChange={handleUserInput} name="role">
                <option value="">--Select Role--</option>
                <option value={`${SD_Roles.CUSTOMER}`}>Customer</option>
                <option value={`${SD_Roles.ADMIN}`}>Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <button type="submit" className="btn btn-success" disabled={loading}>
              Register
            </button>
          </div>
        </form>
      )}

    </div>
  )
}

export default Register