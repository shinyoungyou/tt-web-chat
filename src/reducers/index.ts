import { combineReducers } from "@reduxjs/toolkit";

import chatSlice from "./chat";

const rootReducer = combineReducers({
  chat: chatSlice.reducer,
});

export default rootReducer;