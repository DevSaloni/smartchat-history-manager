import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import './SearchChat.css';

const SearchChat = ({ setCurrentChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`https://smartchat-history-manager.onrender.com/api/chats/search/${searchTerm}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleChatClick = (chat) => {
    setCurrentChat(chat); 
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <h2 className="search-title">Search Chats <FiSearch size={24} /></h2>
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Enter chat title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map((chat) => (
              <div
                key={chat._id}
                className="chat-card"
                onClick={() => handleChatClick(chat)}
              >
                <h3>{chat.title}</h3>
              </div>
            ))
          ) : (
            <p className="no-result">No chats found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchChat;
