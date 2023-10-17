import React, { useState } from 'react'
import menuItemModel from '../../../Interfaces/menuItemModel'
import { Link, useNavigate } from 'react-router-dom'
import { useUpdateShoppingCartMutation } from '../../../Apis/shoppingCartApi';
import { ToastContainer, toast } from 'react-toastify';
import { MiniLoader } from '../Common';
import { apiResponse, userModel } from '../../../Interfaces';
import { toastNotify } from '../../../Helper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';

interface Props {
  menuItem: menuItemModel
}

function MenuItemCard(props: Props) {
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const navigate = useNavigate();
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);

  const handleAddToCart = async (menuItemId: number) => {
    if(!userData.id) {
      navigate('/login');
      return null;
    }

    setIsAddingToCart(true);

    const resp: apiResponse = await updateShoppingCart({
      userId: userData.id,
      menuItemId: menuItemId,
      updateQuantityBy: 1,
    })
    //console.log("hadleAddToCart update response: ", resp);

    if (resp?.data && resp.data.isSuccess) {
      toastNotify(`${props.menuItem.name} is added`, 'success');
    }
    setIsAddingToCart(false);
  }

  return (
    <div className='col-12 col-md-4 col-xl-3 p-4'>
      <div className='card' style={{ boxShadow: '0 1px 6px 0 rgb(0 0 0 / 50%)' }}>
        <div className='card-body pt-2'>
          <div className='row p-1'>
            <Link to={`/menuItemDetail/${props.menuItem.id}`}>
              <img src={props.menuItem.image} style={{ borderRadius: '50%', width: '100%' }} alt="" className='mt-5 image-box' />
            </Link>
          </div>

          {props.menuItem.specialTag && props.menuItem.specialTag.length > 0 && (
            <i className='bi bi-star btn btn-success btn-sm' style={{ position: "absolute", top: "15px", left: "15px", padding: "5px 10px", borderRadius: "3px", outline: "none !important", cursor: "pointer", fontSize: "12px" }}>&nbsp; {props.menuItem.specialTag}</i>
          )}
          {isAddingToCart ? (
            <div style={{ position: "absolute", top: "12px", right: "12px" }}>
              <MiniLoader type="warning" size={60} />
            </div>
          ) : (
            <i onClick={() => handleAddToCart(props.menuItem.id)} className='bi bi-cart-plus btn btn-outline-danger btn-sm' style={{ position: "absolute", top: "15px", right: "15px", padding: "2px 5px", borderRadius: "3px", outline: "none !important", cursor: "pointer" }}></i>
          )}
          <ToastContainer autoClose={2000} hideProgressBar={true} closeOnClick />

          <div className='text-center mt-2'>
            <p className='cart-title m-0 fs-4'>
              <Link to={`/menuItemDetail/${props.menuItem.id}`} style={{ textDecoration: "none", color: "#007e37" }}>
                {props.menuItem.name}
              </Link>
            </p>
            <p className='badge bg-secondary p-1' style={{ fontSize: "10px" }}>{props.menuItem.category}</p>
          </div>

          <p className='card-text' style={{ textAlign: "center", fontSize: "10px", color: "grey" }}>{props.menuItem.description}</p>

          <div className='row text-center'>
            <h4>${props.menuItem.price}</h4>
          </div>
        </div>
      </div>
    </div >
  )
}


export default MenuItemCard