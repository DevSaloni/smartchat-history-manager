import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import SearchChat from './pages/SearchChat';
import ArchivedChatPage from './pages/ArchiveChatPage';
import ChatDetailPage from './pages/ChatDetailPage';
import SummaryPage from './pages/SummaryPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
       <Route path='/login' element={< Login/>} />
        <Route path='/chatsection' element={<ChatPage />} />
        <Route path='/search' element={< SearchChat/>} />
      <Route path="/archived/:userId" element={<ArchivedChatPage/>}/>
     <Route path="/chat/:chatId" element={<ChatDetailPage />} />
    <Route path="/summarize/:chatId" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
