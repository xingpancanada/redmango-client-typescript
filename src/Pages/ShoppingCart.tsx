import React from 'react'
import { CartPickUpDetail, CartSummary } from '../Components/Page/Cart'
import { withAuth } from '../HOC'

function ShoppingCart() {
  return (
    <div className='row w-100' style={{ marginTop: "10px" }}>
      <div className='col-12 col-lg-6 p-4' style={{ fontWeight: 400 }}>
        <CartSummary />
      </div>
      <div className='col-12 col-lg-6 p-4' style={{ fontWeight: 300 }}>
        <CartPickUpDetail />
      </div>
    </div>
  )
}

export default withAuth(ShoppingCart) //HOC