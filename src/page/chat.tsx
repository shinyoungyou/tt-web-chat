import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changeTab, sendPublic, sendPrivate } from '../reducers/chat';
import { Status } from "../interfaces/chat";
import RootState from "../interfaces";

const Chat = () => {
  const { publicChats, privateChats, tab, my } = useSelector((state: RootState)=>state.chat);
  const dispatch = useDispatch();

  const [message, setMessage] = useState<string>('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, [message]);

  const handlePublicSubmit = () => { 
    dispatch(sendPublic({
      senderName: my.username,
      message: message,
      status: Status.MESSAGE
    }))
    setMessage('');
  };

  const handlePrivateSubmit = () => { 
    dispatch(sendPrivate({
      senderName: my.username,
      receiverName: tab,
      message: message,
      status: Status.MESSAGE
    }))
    setMessage('');
  }

  return (
    <div className="chat-box">
      <div className="member-list">
        <ul>
          <li
            onClick={() => {
              dispatch(changeTab("CHATROOM"));
            }}
            className={`member ${tab === "CHATROOM" && "active"}`}
          >
            Chatroom
          </li>
          {[...privateChats.keys()].map((name, index) => (
            <li
              onClick={() => {
                dispatch(changeTab(name));
              }}
              className={`member ${tab === name && "active"}`}
              key={index}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
      {tab === "CHATROOM" && (
        <div className="chat-content">
          <ul className="chat-messages">
            {publicChats.map((chat, index) => (
              <li
                className={`message ${
                  chat.senderName === my.username && "self"
                }`}
                key={index}
              >
                {chat.senderName !== my.username && (
                  <div className="avatar">{chat.senderName as string}</div>
                )}
                <div className="message-data">{chat.message}</div>
                {chat.senderName === my.username && (
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
              value={message}
              onChange={handleChange}
            />
            <button type="button" className="send-button" onClick={handlePublicSubmit}>
              send
            </button>
          </div>
        </div>
      )}
      {tab !== "CHATROOM" && (
        <div className="chat-content">
          <ul className="chat-messages">
            {[...privateChats.get(tab)].map((chat, index) => (
              <li
                className={`message ${
                  chat.senderName === my.username && "self"
                }`}
                key={index}
              >
                {chat.senderName !== my.username && (
                  <div className="avatar">{chat.senderName}</div>
                )}
                <div className="message-data">{chat.message}</div>
                {chat.senderName === my.username && (
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
              value={message}
              onChange={handleChange}
            />
            <button
              type="button"
              className="send-button"
              onClick={handlePrivateSubmit}
            >
              send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
