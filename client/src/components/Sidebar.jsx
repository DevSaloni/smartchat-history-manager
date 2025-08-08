
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCommentDots, FaPlus, FaTrashAlt ,FaClock,FaArchive  } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { SiChatbot } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import './sidebar.css';

const Sidebar = ({ user, setCurrentChat, onSearchClick }) => {
    const [localUser, setLocalUser] = useState({});
    const navigate = useNavigate();

  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setLocalUser({
        name: parsed.name,
        email: parsed.email,
        id: parsed.id || parsed._id
      });
    }
  }, []);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      const res = await fetch(`https://smartchat-history-manager.onrender.com/api/chats/all/${localUser.id}`);
      const data = await res.json();

      // ✅ Only include non-archived chats
      const nonArchivedChats = data.filter((chat) => !chat.aiArchived);
      setRecentChats(nonArchivedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Create new chat
  const handleNewChat = async () => {
    try {
      const res = await fetch('https://smartchat-history-manager.onrender.com/api/chats/save-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: localUser.id,
          messages: [{ role: 'user', content: 'Start your conversation here...' }],
        }),
      });

      const result = await res.json();
      setCurrentChat(result.chat);
      fetchChats(); // Refresh sidebar
    } catch (err) {
      console.error('Error creating new chat:', err);
    }
  };

  // Load full chat by ID
  const handleSelectChat = async (chatId) => {
    try {
      const res = await fetch(`https://smartchat-history-manager.onrender.com/api/chats/${chatId}`);
      if (!res.ok) throw new Error('Failed to fetch chat');
      const fullChat = await res.json();
      setCurrentChat(fullChat);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This chat will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`https://smartchat-history-manager.onrender.com/api/chats/${chatId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete chat');
    }

    setRecentChats((prev) => prev.filter((chat) => chat._id !== chatId));

    // Show success alert
    Swal.fire('Deleted!', 'Your chat has been deleted.', 'success');
  } catch (error) {
    console.error('Error deleting chat:', error);
    Swal.fire('Error!', 'Failed to delete the chat.', 'error');
  }
};


  useEffect(() => {
    fetchChats();
  }, []);

   
useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <aside className="sidebar-container">
      <h2 className="heading">
      <SiChatbot/>
        SmartChat
      </h2>

      <ul className="sidebar-top">
        <li className="sidebar-btn new-chat" onClick={handleNewChat}>
          <FaPlus style={{ marginRight: 8,fontSize:16}} /> New Chat
        </li>
        <li className="sidebar-btn new-chat" onClick={onSearchClick}>
          <FiSearch style={{ fontWeight: 900, marginRight: '8px' }} size={16} /> Search Chats
        </li>
        
      <li className="sidebar-btn new-chat" onClick={() => navigate(`/archived/${localUser.id}`)}>
          <FaArchive style={{ marginRight: '6px', verticalAlign: 'middle' ,fontSize:'16px'}} />
          View Archived
        </li>

      </ul>

      <div className="recent-chats">
        <p className="chat-heading">
          <FaClock style={{ marginRight: '6px', verticalAlign: 'middle' ,fontSize:'22px'}} />
          Recent Chats
        </p>        
        <ul className="chat-list">
          {recentChats.length === 0 ? (
            <li className="chat-title">No recent chats found.</li>
          ) : (
            recentChats.map((chat) => {
              const messages = chat.messages || [];
              const userMsg = messages.slice().reverse().find((m) => m.role === 'user');
              const aiMsg = messages.slice().reverse().find((m) => m.role === 'ai');

              return (
                <li
                  key={chat._id}
                  className="chat-title"
                  style={{ cursor: 'pointer', marginBottom: 10, position: 'relative' }}
                  onClick={() => handleSelectChat(chat._id)}
                >
                  <div style={{ fontWeight: 'bold', fontSize: 14 }}>{chat.title}</div>

                  <FaTrashAlt
                    title="Delete chat"
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'crimson',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat._id);
                    }}
                  />
                </li>
              );
            })
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;  for that file gives
