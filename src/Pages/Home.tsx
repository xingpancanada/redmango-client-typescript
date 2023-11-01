import React from 'react'
import { MenuItemList } from '../Components/Page/Home'
import { Banner } from '../Components/Page/Common'
import { Helmet } from 'react-helmet-async';

function Home() {

  return (
    <>
     <Helmet>
      <title>My Aquatic Store | Home</title>
      <meta name="description" content="Developed by react, redux toolkit, .NetCore, MS SQL, and Azure" />
     </Helmet>

      <Banner />
      <div className='container p-2'>
        <MenuItemList />
      </div>
    </>
  )
}

export default Home