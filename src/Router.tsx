import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './page/register';
import Chat from './page/chat';

// Auth page에서 LogoutCheck까지 해주면 되겠다
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
