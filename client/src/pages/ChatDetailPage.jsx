import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './ChatDetailPage.css';
import html2pdf from 'html2pdf.js';

const ChatDetailPage = () => {
  const { chatId } = useParams();
  const [chatData, setChatData] = useState(null);
  const chatRef = useRef();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(`http://localhost:2011/api/chats/${chatId}`);
        const data = await res.json();
        setChatData(data);
      } catch (err) {
        console.error("Failed to fetch chat:", err);
      }
    };

    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  const handleExportPDF = () => {
    if (!chatRef.current) return;

    // Temporarily remove scroll constraints
    const originalStyle = {
      maxHeight: chatRef.current.style.maxHeight,
      overflow: chatRef.current.style.overflow,
    };

    chatRef.current.style.maxHeight = 'none';
    chatRef.current.style.overflow = 'visible';

    const options = {
      margin: 0.2,
      filename: `${chatData?.title || 'chat'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(options).from(chatRef.current).save().then(() => {
      // Restore original scroll styles
      chatRef.current.style.maxHeight = originalStyle.maxHeight;
      chatRef.current.style.overflow = originalStyle.overflow;
    });
  };

  if (!chatData) return <div className="chatdetail-loading">Loading chat...</div>;

  return (
    <div className="chatdetail-container">
      <div className="chatdetail-header">
        <h2 className="chatdetail-title">{chatData.title}</h2>
        <div className="chatdetail-buttons">
          <button className="export-btn" onClick={handleExportPDF}>Export as PDF</button>
          <Link to={`/summarize/${chatId}`}>
            <button className="summary-btn">Summarize Chat</button>
          </Link>
        </div>
      </div>

      <div className="chatdetail-messages" ref={chatRef}>
        {Array.isArray(chatData.messages) ? (
          chatData.messages.map((msg, i) => (
            <div
              className={`chatdetail-message ${
                msg.sender === 'user' ? 'chatdetail-user' : 'chatdetail-ai'
              }`}
              key={i}
            >
              <span className="chatdetail-sender">{msg.sender}:</span>
              <span className="chatdetail-content">{msg.content}</span>
            </div>
          ))
        ) : (
          <p className="chatdetail-nomsg">No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default ChatDetailPage;
