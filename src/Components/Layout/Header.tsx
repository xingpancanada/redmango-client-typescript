import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { cartItemModel, userModel } from '../../Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Storage/Redux/store';
import { emptyUserState, setLoggedInUser } from '../../Storage/Redux/userAuthSlice';
import { SD_Roles } from '../../Utility/SD';
let logo = require('../../Assets/Images/BigAlsCanada.png');

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);

  // get all cart items from the store via useSelector()
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const handleLogout = () => {
    localStorage.removeItem('redmangousertoken');
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="nav-link" aria-current="page" to="/">
            <img src={logo} style={{ height: '50px' }} className="p-1 mx-3" alt="logo" />
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink className="nav-link" aria-current="page" to="/shoppingCart">
                  <i className='bi bi-cart position-relative'>
                    <span style={{ fontSize: '0.6rem' }} className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {shoppingCartFromStore?.length && userData?.id ? `${shoppingCartFromStore?.length}` : ''}
                    </span>
                  </i>
                </NavLink>
              </li>
              {userData.role === SD_Roles.ADMIN ? (
                <li className="nav-item dropdown mx-2">
                  <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin Panel
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown" style={{fontSize: '0.9rem'}}>
                    <li className="dropdown-item" onClick={()=>navigate("order/myorders")} style={{cursor: 'pointer'}}>My Orders</li>
                    <li className="dropdown-item" onClick={()=>navigate("order/allorders")} style={{cursor: 'pointer'}}>All Orders</li>
                    <li className="dropdown-item" onClick={()=>navigate("/menuitem/menuitemlist")} style={{cursor: 'pointer'}}>Menu Items</li>
                    <li><a className="dropdown-item" href="/" style={{cursor: 'pointer'}}>Something else here</a></li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/order/MyOrders">My Orders</NavLink>
                </li>
              )}

              {/* <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/authtest">AuthTest</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/authtestadmin">AuthTestAdmin</NavLink>
              </li> */}



              <div className='d-flex' style={{ marginLeft: "auto" }}>
                {userData?.id ? (
                  <>
                    <li className='nav-item pt-1'>
                      <button className='btn btn-sm btn-dark form-control text-white rounded mx-2' style={{ fontWeight: 'bold' }}>Welcome, {userData?.firstName}</button>
                    </li>
                    <li className='nav-item pt-1 mx-3'>
                      <button onClick={handleLogout} className='btn btn-sm btn-warning form-control text-white rounded mx-2' style={{ fontWeight: 'bold' }}>Log Out</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className='nav-item pt-1 mx-3'>
                      <NavLink to='/register' className='btn btn-sm btn-primary form-control text-white rounded mx-2' style={{ fontWeight: 'bold' }}>Register</NavLink>
                    </li>
                    <li className='nav-item pt-1 mx-3'>
                      <NavLink to='/login' className='btn btn-sm btn-success form-control text-white rounded mx-2' style={{ fontWeight: 'bold' }}>Log In</NavLink>
                    </li>
                  </>
                )}
              </div>

            </ul>
          </div>
        </div >
      </nav >
    </div >
  )
}

export default Header