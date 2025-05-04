// import { compose, createStore, applyMiddleware } from 'redux';
import { configureStore } from "@reduxjs/toolkit";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { rootReducer } from "./rootReducer";
import categoriesApi from "../apis/categoriesApi";
import usersApi from "../apis/usersApi";
import vouchersApi from "../apis/vouchersApi";
import productsApi from "../apis/productsApi";
import cartApi from "../apis/cartApis";
import ordersApi from "../apis/ordersApi";
import chatApi from "../apis/chatApis";
import flashsaleApi from "../apis/flashsaleApis";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
// const composedEnhancers = composeEnhancer(applyMiddleware(...middleWares));

// export const store = createStore(
//   persistedReducer,
//   undefined,
//   composedEnhancers
// );
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(categoriesApi.middleware)
      .concat(usersApi.middleware)
      .concat(vouchersApi.middleware)
      .concat(productsApi.middleware)
      .concat(cartApi.middleware)
      .concat(ordersApi.middleware)
      .concat(chatApi.middleware)
      .concat(flashsaleApi.middleware),
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware()
  //     .concat(categoriesApi.middleware)
  // .concat(shoppingCartApi.middleware)
  // .concat(authApi.middleware)
  // .concat(paymentApi.middleware)
  // .concat(orderApi.middleware)
  // .concat(couponApi.middleware)
  // .concat(userApi.middleware)
  // .concat(reviewApi.middleware)
  // .concat(statisticApi.middleware),
});
export const persistor = persistStore(store);
