import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
  senderName: string;
  receiverName?: string;
  message: string;
  status: string;
}

interface UserData {
  username: string;
  receivername: string;
  connected: boolean;
  message: string;
}

let stompClient: any = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(
    new Map<string, ChatMessage[]>()
  );
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState<string>("CHATROOM");
  const [userData, setUserData] = useState<UserData>({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage: ChatMessage = {
      senderName: userData.username,
      status: "JOIN",
      message: "",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload: any) => {
    var payloadData: ChatMessage = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        setPublicChats([...publicChats, payloadData]);
        break;
    }
  };

  const onPrivateMessage = (payload: any) => {
    console.log(payload);
    var payloadData: ChatMessage = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName)?.push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list: ChatMessage[] = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const handleMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage: ChatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };
  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };

      if (userData.username !== tab) {
        privateChats.get(tab)?.push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const handleUsername = (event: any) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };

  return (
    <div className="container">
      {userData.connected ? (
        <div></div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter the user name"
            value={userData.username}
            onChange={handleUsername}
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
