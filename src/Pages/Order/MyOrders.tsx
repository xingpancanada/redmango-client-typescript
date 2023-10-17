import React from 'react'
import { withAuth } from '../../HOC'
import { useGetOrdersQuery } from '../../Apis/orderApi'
import { useSelector } from 'react-redux';
import { RootState } from '../../Storage/Redux/store';
import { MainLoader } from '../../Components/Page/Common';
import { OrderList } from '../../Components/Page/Order';

function MyOrders() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetOrdersQuery({ userId }); // filter by userId
  console.log("my orders data", data);

  return (
    <>
      {isLoading ? <MainLoader /> : (
        <>
          <div className='d-flex align-items-center justify-content-between mx-5 mt-5'>
            <h1 className="text-success">My Orders</h1>
          </div>
          <OrderList orderData={data?.apiResponse.result} />
        </>
      )}
    </>
  )
}

export default withAuth(MyOrders)