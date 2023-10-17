import React from 'react'
import { orderHeaderModel } from '../../../Interfaces'
import { useNavigate } from 'react-router-dom';
import { getStatusColor } from '../../../Helper';

export interface OrderListProps {
  //isLoading: boolean;
  orderData: orderHeaderModel[];
}

function OrderList({ orderData }: any) {
  const navigate = useNavigate();

  return (
    <>
      <div className="table px-5">
        <div className="p-2">
          <div className="row border">
            <div className="col-1">ID</div>
            <div className="col-2">Name</div>
            <div className="col-2">Phone</div>
            <div className="col-1">Total</div>
            <div className="col-1">Items</div>
            <div className="col-2">Date</div>
            <div className="col-2">Status</div>
            <div className="col-1"></div>
          </div>

          {orderData.map((order: any, index: number) => {
            const statusColor = getStatusColor(order.status);

            return (
              <div className="row border d-flex align-items-center" style={{fontSize: '0.8rem'}} key={index}>
                <div className="col-1">{order.orderHeaderId}</div>
                <div className="col-2">{order.pickupName}</div>
                <div className="col-2">{order.pickupPhoneNumber}</div>
                <div className="col-1">{order.orderTotal!.toFixed(2)}</div>
                <div className="col-1">{order.totalItems}</div>
                <div className="col-2">{new Date(order.orderDate).toLocaleDateString()}</div>
                <div className="col-2">
                  <span className={`badge bg-${statusColor}`}>{order.status}</span>
                </div>
                <div className="col-1 text-center">
                  <button onClick={() => navigate(`/order/orderDetails/${order.orderHeaderId}`)} className="btn btn-success btn-sm" style={{fontSize: '0.8rem'}}>Details</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default OrderList