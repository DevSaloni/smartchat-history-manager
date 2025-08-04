import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaRegFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

import './ArchiveChatPage.css';

import { FaHistory, FaTrash, FaUndoAlt, FaEye } from 'react-icons/fa';

const ArchiveChatPage = ({ fetchChats }) => {
  const navigate = useNavigate();

    const{userId} = useParams();

  const [archivedChats, setArchivedChats] = useState([]);

  // Fetch archived chats
  useEffect(() => {
    const fetchArchivedChats = async () => {
      try {
        const res = await fetch(`http://localhost:2011/api/chats/archived-chats/${userId}`);
        const data = await res.json();
        setArchivedChats(data);
      } catch (err) {
        console.error('Failed to fetch archived chats:', err);
      }
    };

    fetchArchivedChats();
  }, []);

  const handleRestore = async (chatId) => {
    try {
      await fetch(`http://localhost:2011/api/chats/restore-chat/${chatId}`, {
        method: 'PUT',
      });
      setArchivedChats(prev => prev.filter(chat => chat._id !== chatId));
      fetchChats?.(); // refresh sidebar
    } catch (err) {
      console.error('Error restoring chat:', err);
    }
  };

  const handleViewChat = (chatId) => {
    navigate(`/chat/${chatId}`); 
  };


const handleDelete = async (chatId) => {
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
    await fetch(`http://localhost:2011/api/chats/${chatId}`, {
      method: 'DELETE',
    });
    setArchivedChats((prev) => prev.filter((chat) => chat._id !== chatId));

    // Success alert
    Swal.fire('Deleted!', 'The chat has been removed.', 'success');
  } catch (err) {
    console.error('Error deleting chat:', err);
    Swal.fire('Error!', 'Something went wrong while deleting the chat.', 'error');
  }
};


 

  return (
    <div className="archive-page">
      <h2><FaHistory style={{ marginRight: '10px' }} /> Archived Chats</h2>

      {archivedChats.length === 0 ? (
        <p className="no-archived">📭 No archived chats available</p>
      ) : (
        <div className="archived-list">
          {archivedChats.map(chat => (
            <div key={chat._id} className="archived-card">
              <div className="card-header">
                <h3>{chat.title || 'Archived Chat'}</h3>
            <span className="timestamp">
              {chat.archivedAt
                ? ` Created on: ${new Date(chat.archivedAt).toLocaleString()}`
                : `Archived on: ${new Date(chat.createdAt).toLocaleString()}`}
            </span>
              </div>
            <p className="chat-snippet">
                <FaRegFileAlt style={{ marginRight: '7px', verticalAlign: 'middle',fontSize:'19px',color:'#7c3aed' }} />
               {chat.messages?.[chat.messages.length - 1]?.content?.slice(0, 100) || 'No messages yet'}
            </p>
              <div className="card-actions">
                <button onClick={() => handleRestore(chat._id)} className="restore-btn">
                  <FaUndoAlt /> Restore
                </button>
                   <button onClick={() => handleViewChat(chat._id)}>
                  <FaEye /> View
                </button>
                <button onClick={() => handleDelete(chat._id)} className="delete-btn">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveChatPage;
