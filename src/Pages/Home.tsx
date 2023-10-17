import React from 'react'
import { MenuItemList } from '../Components/Page/Home'
import { Banner } from '../Components/Page/Common'
import { Helmet } from 'react-helmet-async';

const colornameUrl = "https://gist.githubusercontent.com/xingpancanada/3cc11f03ef23facf6de2b0d92ff6a88a/raw/csscolorsheet.csv";

export async function getColorNames() {
  const res = await fetch(colornameUrl);
  return await res.text();
}

function Home() {
  const colorNames = getColorNames();
  console.log("colorNames", colorNames);

  const width = 960;
  const height = 500;
  const circleX = width / 2;
  const circleY = height / 2;
  const circleRadius = 5;

  const handleMouseMove = (e: any) => {
    console.log("move event: " + e);
  }

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