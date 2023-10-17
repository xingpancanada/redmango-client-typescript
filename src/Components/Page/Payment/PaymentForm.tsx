import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { toastNotify } from '../../../Helper';
import { apiResponse, cartItemModel, orderSummaryProps } from '../../../Interfaces';
import { useCreateOrderMutation } from '../../../Apis/orderApi';
import { SD_Status } from '../../../Utility/SD';
import { useNavigate } from 'react-router-dom';

//4242 4242 4242 4242 

function PaymentForm({ data, userInput }: orderSummaryProps) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const [createOrderMutation] = useCreateOrderMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required", // stay on the payment page
    });

    if (result.error) {
      toastNotify("An error occurred when processing payment.", "error");
      //console.log(result.error.message);
    } else {
      //console.log(result);

      let grandTotal = 0;
      let totalItems = 0;
      const orderDetailsCreateDto: any = [];
      data.cartItems?.forEach((item: cartItemModel) => {
        const tempOrderDetail: any = {};
        tempOrderDetail['menuItemId'] = item.menuItem?.id;
        tempOrderDetail['quantity'] = item.quantity;
        tempOrderDetail['itemName'] = item.menuItem?.name;
        tempOrderDetail['price'] = item.menuItem?.price;

        orderDetailsCreateDto.push(tempOrderDetail);
        grandTotal += (item.quantity! * item.menuItem?.price!);
        totalItems += item.quantity;
      });

      const response: apiResponse = await createOrderMutation({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        totalItems: totalItems,
        orderTotal: grandTotal,
        orderDetailsCreateDto: orderDetailsCreateDto,
        stripePaymentIntentId: data.stripePaymentId,
        appUserId: data.userId,
        status: result.paymentIntent.status==='succeeded' ? SD_Status.CONFIRMED : SD_Status.PENDING,
      });
      console.log("response create order:", response);

      if(response){
        if(response.data?.result.status === SD_Status.CONFIRMED){
          navigate(`/order/orderConfirmed/${response.data.result.orderHeaderId}`);
        }else{
          navigate('/failed');
        }
      }

    }
    setIsProcessing(false);
  }


  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-primary mb-3">Payment</h3>
      <PaymentElement />
      <div className='d-flex'>
        <button className='btn btn-primary my-4 px-4 mx-auto shadow' disabled={!stripe || isProcessing}>
          <span id="button-text">
            {isProcessing ? 'Processing' : 'Submit Order'}
          </span>
        </button>
      </div>
    </form>
  )
}

export default PaymentForm