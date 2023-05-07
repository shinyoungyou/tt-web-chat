import SockJS from "sockjs-client";
import {
  Stomp,
  CompatClient,
  StompHeaders,
  IFrame,
  frameCallbackType,
  messageCallbackType,
} from "@stomp/stompjs";

import { backUrl } from "../config";

// export const instance = axios.create({
//   baseURL: backUrl, // cors
//   withCredentials: true, // cookie (member info)
// });

let stompClient: CompatClient;

export const onConnect = (connectCallback?: frameCallbackType) => {
  let socket = new SockJS(`${backUrl}/ws`);
  let stompClient: CompatClient = Stomp.over(socket);
  stompClient.connect({}, connectCallback, (error: IFrame) => {
    console.error(error);
  });
};

export const onSubscribe = (destination: string, callback: messageCallbackType) => {
  onConnect(() => {
    stompClient.subscribe(destination, callback);
  })
};

export const onSend =  (destination: string, headers?: StompHeaders, body?: string) => {
  onConnect(() => {
    stompClient.send(destination, headers, body);
  })
};
