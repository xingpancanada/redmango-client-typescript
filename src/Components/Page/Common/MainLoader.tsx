import React from 'react'

function MainLoader() {
  return (
    <div style={{
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className='spinner-border text-warning' style={{width:"2rem", height:"2rem"}}>
      </div>
    </div>
  )
}

export default MainLoader