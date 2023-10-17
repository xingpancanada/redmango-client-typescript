import React, { useEffect, useState } from 'react'
import { apiResponse, cartItemModel, userModel } from '../../../Interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Storage/Redux/store'
import { inputHelper } from '../../../Helper';
import { MiniLoader } from '../Common';
import { useInitiatePaymentMutation } from '../../../Apis/paymentApi';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { setLoggedInUser } from '../../../Storage/Redux/userAuthSlice';

function CartPickUpDetail() {
  // get all cart items from the store via useSelector()
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const dispatch = useDispatch()
  let userData: userModel = useSelector((state: RootState) => state.userAuthStore);
  // // below for refresh page cannot get userdata from store
  // if (!userData.id) {
  //   const localToken = localStorage.getItem("redmangousertoken");
  //   if (localToken) {
  //     const { firstName, id, email, role }: userModel = jwt_decode(localToken);
  //     userData = { firstName, id, email, role };
  //   }
  // }

  const initialUserData = {
    name: userData.firstName,
    email: userData.email,
    phoneNumber: ''
  }
  let grandTotal = 0;
  let totalItems = 0;

  shoppingCartFromStore.map((cartItem: cartItemModel) => {
    totalItems += cartItem.quantity ?? 0;
    grandTotal += (cartItem.menuItem?.price ?? 0) * (cartItem.quantity ?? 0);
    return null;
  });

  const [userInput, setUserInput] = useState(initialUserData);
  const [loading, setLoading] = useState(false);
  const [initiatePaymentMutation] = useInitiatePaymentMutation();
  const navigate = useNavigate();

  // below for refresh page cannot get userdata from store
  useEffect(() => {
    setUserInput({
      name: userData.firstName,
      email: userData.email,
      phoneNumber: ''
    })
  }, [userData]);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data }: apiResponse = await initiatePaymentMutation(userData.id); // for stripe payment
    const orderSummary = { grandTotal, totalItems };
    //console.log('data response from initiatePaymentMutation:', data);

    navigate("/payment", {
      //state: {apiResult: data?.result, userData, orderSummary, userInput }
      state: { apiResult: data?.result, userInput }
    });
  };


  return (
    <div className="border rounded pb-5 pt-3">
      <h2 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h2>

      <form className="col-10 mx-auto" onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          Pickup Name
          <input
            type="text"
            className="form-control"
            value={userInput.name}
            onChange={handleUserInput}
            placeholder="name..."
            name="name"
            required
          />
        </div>
        <div className="form-group mt-3">
          Pickup Email
          <input
            type="email"
            className="form-control"
            value={userInput.email}
            onChange={handleUserInput}
            placeholder="email..."
            name="email"
            required
          />
        </div>

        <div className="form-group mt-3">
          Pickup Phone Number
          <input
            type="text"
            className="form-control"
            value={userInput.phoneNumber}
            onChange={handleUserInput}
            placeholder="phone number..."
            name="phoneNumber"
            required
          />
        </div>
        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Grand Total : ${grandTotal.toFixed(2)}</h5>
            <h5>Number of items : {totalItems}</h5>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          style={{ height: '3rem' }}
          disabled={loading}
        >
          {loading ? <MiniLoader /> : "Looks Good? Place Order!"}
        </button>
      </form>
    </div>
  )
}

export default CartPickUpDetail