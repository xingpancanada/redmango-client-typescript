import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import { useLocation } from 'react-router'
import { PaymentForm } from '../Components/Page/Payment';
import { OrderSummary } from '../Components/Page/Order';

//stripe publishable key: pk_test_51NssKUA1Xo987N23PJKzRD2PVmjhqdjJT0pzJKCxMHmdBNZchVcEp0i9r0l2W7Bsv91SikmkuhvP73QUe5ybV5uX00qypM092D

function Payment() {
  const {
    state: { apiResult, userInput }
  } = useLocation();  // get data from navigate
  //console.log('useLocation apiResult: ', apiResult);
  //console.log('useLocation userInput: ', userInput);

  // load stripe via stripe publishable key:
  const stripePromise = loadStripe('pk_test_51NssKUA1Xo987N23PJKzRD2PVmjhqdjJT0pzJKCxMHmdBNZchVcEp0i9r0l2W7Bsv91SikmkuhvP73QUe5ybV5uX00qypM092D')
  const options = {
    clientSecret: apiResult.clientSecret // get client secret from apiResult
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className='container py-5'>
        <div className='row'>
          <div className='col-md-6 px-4'>
            <OrderSummary data={apiResult} userInput={userInput} />
          </div>
          <div className='col-md-6 px-4'>
            <PaymentForm data={apiResult} userInput={userInput} />
          </div>
        </div>
      </div>
    </Elements>
  )
}

export default Payment