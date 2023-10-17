import { Route, Routes } from 'react-router-dom';
import '../App.css';
import { Header, Footer } from '../Components/Layout';
import { AccessDenied, AuthTest, AuthTestAdmin, Home, Login, MenuItemDetail, MenuItemList, MenuItemUpsert, MyOrders, NotFound, OrderConfirmed, OrderDetails, Payment, Register } from '../Pages';
import { useDispatch, useSelector } from 'react-redux';
import { useGetShoppingCartQuery } from '../Apis/shoppingCartApi';
import { useEffect, useState } from 'react';
import { setShoppingCart } from '../Storage/Redux/shoppingCartSlice';
import ShoppingCart from '../Pages/ShoppingCart';
import jwt_decode from "jwt-decode";
import { userModel } from '../Interfaces';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { RootState } from '../Storage/Redux/store';
import AllOrders from '../Pages/Order/AllOrders';

function App() {
  const [skip, setSkip] = useState(true); // when refresh home page, it gets shoppingCart twice. The first time is userId=null and gets error message.
  const dispatch = useDispatch();
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);

  let localUser: userModel;
  useEffect(() => {
    const localToken = localStorage.getItem("redmangousertoken");
    if (localToken) {
      localUser = jwt_decode(localToken);
      dispatch(setLoggedInUser(localUser));
    }
  });
  
  const { data, isLoading } = useGetShoppingCartQuery(userData.id, {skip: skip}); // userId

  useEffect(() => {
    if(userData.id){
      setSkip(false);
    }
  },[userData]);
 
  useEffect(()=> {
    if(!isLoading) {
      //console.log("useGetShoppingCartQuery data: ", data.result);
      dispatch(setShoppingCart(data?.result?.cartItems));
    }
  }, [data]);

  return (
    <div className=''>
      <Header />
      <div className='pb-5'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menuItemDetail/:menuItemId" element={<MenuItemDetail />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order/orderconfirmed/:id" element={<OrderConfirmed />} />
          <Route path="/order/myOrders" element={<MyOrders />} />
          <Route path="/order/allOrders" element={<AllOrders />} />
          <Route path="/order/orderDetails/:id" element={<OrderDetails />} />
          <Route path="/menuitem/menuitemlist" element={<MenuItemList />} />
          <Route path="/menuitem/menuitemupsert/:id" element={<MenuItemUpsert />} />
          <Route path="/menuitem/menuitemupsert" element={<MenuItemUpsert />} />
          <Route path="/accessdenied" element={<AccessDenied />} />
          <Route path="/authtest" element={<AuthTest />} />
          <Route path="/authtestadmin" element={<AuthTestAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
      <Footer />
    </div>
  );
}

export default App;
