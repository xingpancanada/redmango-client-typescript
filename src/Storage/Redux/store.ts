import { shoppingCartReducer } from './shoppingCartSlice';
import { configureStore } from "@reduxjs/toolkit";
import { menuItemReducer } from "./menuItemSlice";
import { authApi, menuItemApi, orderApi, paymentApi, shoppingCartApi } from "../../Apis";
import { userAuthReducer } from './userAuthSlice';

const store = configureStore({
  reducer: {
    menuItemStore: menuItemReducer,
    shoppingCartStore: shoppingCartReducer, // 244
    userAuthStore: userAuthReducer,
    [menuItemApi.reducerPath]: menuItemApi.reducer, //227
    [shoppingCartApi.reducerPath]: shoppingCartApi.reducer, //235
    [authApi.reducerPath]: authApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(menuItemApi.middleware)
    .concat(shoppingCartApi.middleware)
    .concat(authApi.middleware)
    .concat(paymentApi.middleware)
    .concat(orderApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;

export default store;