import SockJS from "sockjs-client";
import { Stomp,
  CompatClient,
  StompHeaders,
  IFrame,
  frameCallbackType,
  messageCallbackType, 
} from "@stomp/stompjs";

import { backUrl } from "../config";

class StompClient {
	socket = new SockJS(`${backUrl}/ws`);
	stompClient: CompatClient = Stomp.over(this.socket);

	// 웹소켓 연결 요청 & 구독 요청
	onConnect = (destination: string, callback: messageCallbackType = () => {}) => {
		let newMessage = "";
		this.stompClient.connect({}, () => {
			this.stompClient.subscribe(destination, callback);
		}, (error: IFrame) => {
      console.error(error);
    });
		return newMessage;
	};

	onSend = (destination: string, headers?: StompHeaders, body?: string)  => {
		this.stompClient.send(destination, headers, body);
	};

	// receiveMessage = () => {};

	onDisconnect = () => {
		this.stompClient.disconnect();
	};
} 

export default new StompClient;