import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./slices/authSlice";
import orderReducer from "./slices/seller/orderSlice";

import variationReducer from "./slices/seller/variationSlice";
import { categoriesApi } from "../apis/categoriesApi";
import usersApi from "../apis/usersApi";
import vouchersApi from "../apis/vouchersApi";
import productsApi from "../apis/productsApi";
import productFilterReducer from "./slices/productFilterSlice";
import cartApi from "../apis/cartApis";
import ordersApi from "../apis/ordersApi";
import chatApi from "../apis/chatApis";
import flashsaleApi from "../apis/flashsaleApis";
// import dataReducer from "./data/data.reducer";
// import useSpecModalReducer from "../hooks/useSpecModal";
// import useLoginReducer from "../hooks/useLoginModal";
// import useRegisterReducer from "../hooks/useRegisterModal";
// import cartReducer from "../store/cart/cartSlice";
export const rootReducer = combineReducers({
  //   filter: filterReducer,
  user: userReducer,
  order: orderReducer,
  variation: variationReducer,
  filter: productFilterReducer,
  //   useSpecModal: useSpecModalReducer,
  //   useLoginModal: useLoginReducer,
  //   useRegisterModal: useRegisterReducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [vouchersApi.reducerPath]: vouchersApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [flashsaleApi.reducerPath]: flashsaleApi.reducer,
  cart: {},
});
