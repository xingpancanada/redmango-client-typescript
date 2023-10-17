import { cartItemModel, orderSummaryProps, userModel } from '../../../Interfaces';
import { getStatusColor } from '../../../Helper';
import { useNavigate } from 'react-router-dom';
import { SD_Roles, SD_Status } from '../../../Utility/SD';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';
import { useUpdateOrderDetailsMutation } from '../../../Apis/orderApi';
import { useState } from 'react';
import { MainLoader } from '../Common';

// export interface orderSummaryProps {
//   data: {
//     id?: number;
//     cartItems?: shoppingCartModel[];
//     cartTotal?: number;
//     userId?: string;
//     stripePaymentId?: string;
//     status?: SD_Status;
//   };
//   userInput: {
//     name?: string;
//     email?: string;
//     phoneNumber?: string;
//   }
// }


function OrderSummary(props: orderSummaryProps) {
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);
  const badgeTypeColor = getStatusColor(props.data.status!);
  const navigate = useNavigate();
  const [loading, setIsLoding] = useState(false);
  const dispatch = useDispatch();
  const [updateOrderDetailsMutation] = useUpdateOrderDetailsMutation();

  const nextStatus: any = props.data.status === SD_Status.CONFIRMED ? { color: 'info', value: SD_Status.BEING_COOKED } :
    props.data.status === SD_Status.BEING_COOKED ? { color: 'warning', value: SD_Status.READY_FOR_PICKUP } :
      props.data.status === SD_Status.READY_FOR_PICKUP && { color: 'success', value: SD_Status.COMPLETED };

  const handleNextStatus = async () => {
    setIsLoding(true);
    console.log('props data:', props.data);
    await updateOrderDetailsMutation({
      orderHeaderId: props.data.id,
      status: nextStatus.value,
    });
    setIsLoding(false);
  }

  const handleCancel = async () => {
    setIsLoding(true);
    await updateOrderDetailsMutation({
      orderHeaderId: props.data.id,
      status: SD_Status.CANCELLED,
    });
    setIsLoding(false);
  }

  return (
    <div>
      {loading ? <MainLoader /> : (
        <>
          <div className='d-flex justify-content-between align-items-center'>
            <h3 className="text-success">Order Summary</h3>
            <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>{props.data.status}</span>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name : {props.userInput.name}</div>
            <div className="border py-3 px-2">Email : {props.userInput.email}</div>
            <div className="border py-3 px-2">Phone : {props.userInput.phoneNumber}</div>
            <div className="border py-3 px-2">
              <h4 className="text-success">Menu Items</h4>
              <div className="p-3">
                {props.data?.cartItems?.map((cartItem: cartItemModel, index: number) => {
                  return (
                    <div key={index} className="d-flex" style={{ fontSize: '0.8rem' }}>
                      <div className="d-flex w-100 justify-content-between">
                        <p>{cartItem.menuItem?.name}</p>
                        <p>${cartItem.menuItem?.price} x {cartItem.quantity} =</p>
                      </div>
                      <p style={{ width: "70px", textAlign: "right" }}>$ {((cartItem.menuItem?.price ?? 0) * (cartItem.quantity ?? 0)).toFixed(2)}</p>
                    </div>
                  )
                })}
                <hr />
                <h5 className="text-danger" style={{ textAlign: "right" }}>
                  ${props.data?.cartTotal?.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-between align-items-center mt-3'>
            <button onClick={() => navigate(-1)} className='btn btn-sm btn-secondary'>Back to Orders</button>
            {userData.role === SD_Roles.ADMIN && (
              <div>
                {props.data.status !== SD_Status.CANCELLED && props.data.status !== SD_Status.COMPLETED && (
                  <button className='btn btn-sm btn-danger mx-2' onClick={handleCancel}>Cancel Order</button>
                )}
                <button onClick={handleNextStatus} className={`btn btn-sm btn-${nextStatus.color} mx-2`}>{nextStatus.value}</button>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  )
}

export default OrderSummary