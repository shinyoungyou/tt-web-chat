import React, { useState, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { register, connect, subscribePublic, subscribePrivate } from '../reducers/chat';
import { Status } from "../interfaces/chat";

const Register = () => {
  const [username, setUsername] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, [username]);

  const handleSubmit = () => {
    dispatch(subscribePublic());
    dispatch(subscribePrivate());
    dispatch(register({
      senderName: username,
      status: Status.JOIN
    }));
    dispatch(connect());
    navigate("/chat");
  };
  
  return (
    <div className="register">
      <input
        placeholder="Enter your name"
        name="username"
        value={username}
        onChange={handleChange}
      />
      <button type="button" onClick={handleSubmit}>
        connect
      </button>
    </div>
  );
};

export default Register;
