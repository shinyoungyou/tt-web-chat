import { createSlice } from "@reduxjs/toolkit";
import ChatState from "../interfaces/chat";

import { IMessage } from "@stomp/stompjs";
import stompClient from "../actions";

import { Status } from "../interfaces/chat";


const initialState: ChatState = {
  publicChats: [],
  privateChats: new Map(),
  tab: "CHATROOM",
  my: {
    username: '',
    receivername: '',
    connected: false,
    message: ''
  },
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    register(state, action) {
      // action.payload = {
      //   senderName: state.my.username,
      //   status: Status.JOIN
      // };
      state.my.username = action.payload.senderName
      stompClient.onSend("/app/message", {}, JSON.stringify(action.payload));
    },
    connect(state) {
      state.my.connected = true;
    },
    disconnect(state) {
      state.my.connected = false;
    },
    subscribePublic(state) {
      stompClient.onSubscribe('/chatroom/public', async (response: IMessage) => {
        const responseData = await JSON.parse(response.body);
        switch (responseData.status) {
          case Status.JOIN:
            if (!state.privateChats.get(responseData.senderName)) {
              state.privateChats.set(responseData.senderName,[]);
            }
            break;
          case Status.MESSAGE:
            state.publicChats.push(responseData);
            break;
        }
      });
    },
    subscribePrivate(state) {
      stompClient.onSubscribe('/user/'+state.my.username+'/private', async (response: IMessage)=>{
        console.log(response);
        const responseData = await JSON.parse(response.body);
        if(state.privateChats.get(responseData.senderName)){
          state.privateChats.get(responseData.senderName).push(responseData);
        } else {
          state.privateChats.set(responseData.senderName, [responseData]);
        }
      });
    },
    changeTab(state, action) {
      state.tab = action.payload;
    },
    sendPublic(state, action) {
      // action.payload = {
      //   senderName: state.my.username,
      //   message: state.my.message,
      //   status: Status.MESSAGE
      // }
      stompClient.onSend('/app/message', {}, JSON.stringify(action.payload));
      state.my.message = '';
    },
    sendPrivate(state, action) {
      // action.payload = {
      //   senderName: state.my.username,
      //   receiverName: state.tab,
      //   message: state.my.message,
      //   status: Status.MESSAGE
      // };
      
      if(state.my.username !== state.tab){
        state.privateChats.get(state.tab).push(action.payload);
      }
      stompClient.onSend("/app/private-message", {}, JSON.stringify(action.payload));
      state.my.message = '';
    },
  },
})

export const { register, connect, disconnect, subscribePublic, subscribePrivate, changeTab, sendPublic, sendPrivate } = chatSlice.actions
export default chatSlice;