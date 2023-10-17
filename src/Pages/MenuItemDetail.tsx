import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetMenuItemByIdQuery } from '../Apis/menuItemApi';
import { useUpdateShoppingCartMutation } from '../Apis/shoppingCartApi';
import { MainLoader, MiniLoader } from '../Components/Page/Common';
import { apiResponse, userModel } from '../Interfaces';
import { toastNotify } from '../Helper';
import { useSelector } from 'react-redux';
import { RootState } from '../Storage/Redux/store';


function MenuItemDetail() {
  const { menuItemId } = useParams();
  const { data, isLoading } = useGetMenuItemByIdQuery(menuItemId);
  const navigate = useNavigate();
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const [updateShoppingCart] = useUpdateShoppingCartMutation();

  function handleQuantity(counter: number) {
    let newQuantity = quantity + counter;
    if (newQuantity <= 0) {
      setQuantity(1)
    } else {
      setQuantity(newQuantity);
    }
  }

  const handleAddToCart = async (menuItemId: number) => {
    if(!userData.id) {
      navigate('/login');
      return null;
    }

    setIsAddingToCart(true);

    const resp: apiResponse = await updateShoppingCart({
      userId: userData.id,
      menuItemId: menuItemId,
      updateQuantityBy: quantity,
    })
    //console.log("hadleAddToCart update response: ", resp);

    if (resp?.data && resp.data.isSuccess) {
      toastNotify(`${data?.result?.name} is added`, 'success');
    }

    setIsAddingToCart(false);
  }

  return (
    <div className='container pt-4'>
      {
        !isLoading ? (
          <div className='row'>
            <div className='col-7'>
              <h3 className='text-success pb-3'>{data?.result?.name}</h3>
              <span>
                <span className='badge text-bg-dark pt-2' style={{ height: "32px", fontSize: "16px" }}>
                  {data?.result?.category}
                </span>
              </span>
              <span>
                <span className='badge text-bg-success pt-2 mx-2' style={{ height: "32px", fontSize: "16px" }}>
                  {data?.result?.specialTag}
                </span>
              </span>
              <p className='pt-4' style={{ fontSize: "18px" }}>
                {data?.result?.description}
              </p>
              <span className='h4'>${data?.result?.price}</span>
              <span className='px-3 pb-1 mx-5 pt-2' style={{ border: "1px solid #333", borderRadius: '30px' }}>
                <i onClick={() => handleQuantity(-1)} className='bi bi-dash p-1 text-danger' style={{ fontSize: "22px", cursor: "pointer" }}></i>
                <span className='h4 mt-3 px-1'>{quantity}</span>
                <i onClick={() => handleQuantity(1)} className='bi bi-plus p-1 text-success' style={{ fontSize: "22px", cursor: "pointer" }}></i>
              </span>

              <div className='row pt-4'>
                <div className='col-5'>
                  <button className='btn btn-secondary form-control' onClick={() => navigate(-1)}>
                    Back to Home
                  </button>
                </div>
                <div className='col-5'>
                  {isAddingToCart ? (
                    <button disabled className='btn btn-success form-control' style={{ height: '2.4rem' }}>
                      <MiniLoader size={50} />
                    </button>
                  ) : (
                    <button onClick={() => handleAddToCart(+menuItemId)} className='btn btn-success form-control' style={{ height: '2.4rem' }}>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className='col-5'>
              <img src={data?.result?.image} alt="no content" width="100%" style={{ borderRadius: "50%" }} />
            </div>
          </div>

        ) : (
          <MainLoader />
        )
      }
    </div>
  )
}

export default MenuItemDetail