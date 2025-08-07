import React, { useState, useEffect } from 'react';
import './ChatArea.css';
import { FaUserCircle, FaPaperPlane, FaArchive, FaArrowDown, FaChevronDown } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ChatArea = ({ currentChat, fetchChats }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [archivedChats, setArchivedChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState({name:'',email:''});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const {userId} = useParams();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (currentChat) {
      const convertedMessages = currentChat.messages.map(msg => ({
        sender: msg.role,
        text: msg.content,
      }));
      setMessages(convertedMessages);
    } else {
      const local = localStorage.getItem('chatMessages');
      if (local) {
        setMessages(JSON.parse(local));
      } else {
        setMessages([{ sender: 'ai', text: 'Hi there! How can I help you today?' }]);
      }
    }
  }, [currentChat]);

  useEffect(() => {
    if (!currentChat) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages, currentChat]);

  useEffect(() => {
    if (messages.length > 30) {
      setShowAlert(true);
    }
  }, [messages]);

    useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name,
        email: parsed.email,
        id: parsed.id || parsed._id
      });
    }
  }, []);


  const handleArchive = async () => {
    try {
      if (currentChat?._id) {
        const res = await fetch(`https://smartchat-history-manager.onrender.com/api/chats/archive-chat/${currentChat._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
          fetchChats?.();
          setMessages([{ sender: 'ai', text: 'Chat archived. Start a new conversation 😊' }]);
          setShowAlert(false);
        } else {
          console.error('Server did not respond with OK while archiving chat.');
        }
      }
    } catch (error) {
      console.error('Failed to archive chat:', error);
    }
  };

  const handleContinue = () => {
    setShowAlert(false);
  };

  const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessages = [...messages, { sender: 'user', text: input }];
  setMessages(newMessages);
  setInput('');
  setLoading(true);

  try {
    if (currentChat?._id) {
      await fetch(`https://smartchat-history-manager.onrender.com/api/chats/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChat._id,
          message: { role: 'user', content: input },
        }),
      });

      if (
        !currentChat.title ||
        currentChat.title === 'New Chat' ||
        currentChat.title.startsWith('Start your')
      ) {
        const newTitle = input.slice(0, 40);
        await fetch(`https://smartchat-history-manager.onrender.com/api/chats/update-title/${currentChat._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });

        fetchChats?.();
      }
    }

    const res = await fetch('https://smartchat-history-manager.onrender.com/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [
          {
            role: 'system',
            content: `You're an expert developer and teacher. Always explain answers in:
              - Simple and clear bullet points.
              - Add emojis that match the point.
              - Use line breaks between bullets.
              - Format like ChatGPT replies with organized sections.`,
          },
          ...newMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'ai',
            content: msg.text,
          })),
        ],
      }),
    });

   if (!res.ok) {
  const errData = await res.json();
  console.error('Backend error:', errData);
  setMessages(prev => [...prev, { sender: 'ai', text: 'Something went wrong 😢' }]);
  setLoading(false);
  return;
}

const data = await res.json();
const aiText = data.reply || 'No response.';

    if (currentChat?._id) {
      await fetch(`https://smartchat-history-manager.onrender.com/api/chats/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChat._id,
          message: { role: 'ai', content: aiText },
        }),
      });
    }

  } catch (err) {
    console.error(err);
    setMessages(prev => [...prev, { sender: 'ai', text: 'Something went wrong 😢' }]);
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

 const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of your session.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, log me out',
  });

  if (result.isConfirmed) {
    localStorage.removeItem('user');
    await Swal.fire('Logged out!', 'You have been successfully logged out.', 'success');
    navigate('/login'); 
  }
};
  return (
    <div className="chat-box">
      {/* Header */}
      <div className="header-bar">
        <ThemeToggle />
      {/* User Profile Dropdown */}
      <div className="user-profile-wrapper">
        <div className="user-avatar" onClick={() => setShowUserMenu(prev => !prev)}>
          {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
        </div>

        {showUserMenu && (
          <div className="user-dropdown">
            <div className="user-info">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
            <hr />
            <button onClick={() => navigate(`/archived/${user.id}`)}><FaComments  style={{fontSize:'1.5rem',marginRight: '8px'}}/> Chat History</button>
            <button onClick={handleLogout}>  <FiLogOut style={{ fontSize: '1.5rem', marginRight: '8px' }} /> Logout
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Scroll Button */}
      {messages.length > 3 && (
        <div className="scroll-btn-wrapper">
          <button
            className="scroll-to-bottom"
            onClick={() => {
              const el = document.querySelector('.messages');
              el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
            }}
          >
            <FaChevronDown />
          </button>
        </div>
      )}

      {/* Archive Alert */}
      {showAlert && (
        <div className="alert-popup">
          <div className="alert-box">
            <p>This chat is getting long. Would you like to archive it?</p>
            <div className="alert-actions">
              <button onClick={handleArchive}>
                <FaArchive style={{ marginRight: "8px", fontWeight: 800, fontSize: '17px' }} />
                Archive
              </button>
              <button onClick={handleContinue}>
                <FaArrowDown style={{ marginRight: "8px", fontSize: '17px' }} />
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === 'user' ? 'user' : 'ai'}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message ai">Typing...</div>}
      </div>

      {/* Welcome Text */}
      <div className="center-message">How can I assist you today?</div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="send-btn" onClick={sendMessage}>
          <FaPaperPlane style={{ fontSize: '22px' }} />
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
