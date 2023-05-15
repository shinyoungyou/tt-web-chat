import { combineReducers } from "@reduxjs/toolkit";

import chatSlice from "./chat";
import { chatApi } from '../actions/chat';

const rootReducer = combineReducers({
  chat: chatSlice.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
});

export default rootReducer;