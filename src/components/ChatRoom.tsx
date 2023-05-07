import { useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

interface IChatData {
  username: string;
  recievername: string;
  connected: boolean;
  message: string;
}

interface IPublicChat {
  status: string;
  senderName: string;
  body: string;
  payloadData: string;
  message: string;
}

let stompClient: any = null;

const ChatRoom = () => {
  const [publicChats, setPublicChats] = useState<IPublicChat[]>([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [tab, setTab] = useState('채팅방');
  const [userData, setUserData] = useState<IChatData>({
    username: '',
    recievername: '',
    connected: false,
    message: '',
  });

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
  };

  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
      };
      console.log(chatMessage);
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: 'MESSAGE',
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }
  };

  const registerUser = () => {
    let sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(sock);
    stompClient.connect({}, onConncted, onError);
  };

  const onConncted = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
    stompClient.subscribe(
      '/user/' + userData.username + '/private',
      onPrivateMessageReceived
    );
  };

  const onPublicMessageReceived = (payload: IPublicChat) => {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'JOIN':
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case 'MESSAGE':
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onError = (err: unknown) => {
    console.log(err);
  };

  const onPrivateMessageReceived = (payload: any) => {
    let payloadData = JSON.parse(payload);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => {
                  setTab('CHATROOM');
                }}
                className={`member ${tab === 'CHATROOM' && 'active'}`}
              >
                Chatroom
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => {
                    setTab(name);
                  }}
                  className={`member ${tab === name && 'active'}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          {tab === 'CHATROOM' && (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username && 'self'
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendValue}
                >
                  send
                </button>
              </div>
            </div>
          )}
          {tab !== 'CHATROOM' && (
            <div className="chat-content">
              <ul className="chat-messages">
                {/* {[...privateChats.get(tab)].map((chat, index) => ( */}
                {[...privateChats].map(({ chat }: any, index: number) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username && 'self'
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPrivateValue}
                >
                  send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
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
