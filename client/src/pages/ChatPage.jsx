import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import SearchChat from '../pages/SearchChat'; 
import './ChatPage.css';

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [user, setUser] = useState({ _id: '123', name: 'Saloni' });
  const [showSearch, setShowSearch] = useState(false); 

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        user={user}
        setCurrentChat={setCurrentChat}
        onSearchClick={() => setShowSearch(!showSearch)} 
      />
      
      <div style={{ flex: 1, position: 'relative' }}>
        {showSearch && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            background: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '10px',
          }}>
            <SearchChat setCurrentChat={setCurrentChat} />
          </div>
        )}
        <ChatArea currentChat={currentChat} />
      </div>
    </div>
  );
};

export default ChatPage;
