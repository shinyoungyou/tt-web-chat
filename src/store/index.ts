import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import { setupListeners } from '@reduxjs/toolkit/query';

import rootReducer from "../reducers";
import { chatApi } from '../actions/chat';

const store = configureStore({ 
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(logger)
      .concat(chatApi.middleware)
  },
  devTools: true,
});

setupListeners(store.dispatch);

export default store;