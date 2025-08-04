import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaBrain } from 'react-icons/fa';

import './SummaryPage.css';

const SummaryPage = () => {
  const { chatId } = useParams();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`http://localhost:2011/api/chats/summarize/${chatId}`);
        const data = await res.json();

        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary("Summary not available. Try again later.");
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setSummary("Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [chatId]);

  return (
    <div className="summary-container">
      <div className="summary-box">
        <h2 className="summary-heading">
            <FaBrain style={{ marginRight: '8px', verticalAlign: 'middle' ,fontSize:'39px'}} />
           AI Chat Summary</h2>
        {loading ? (
          <p className="summary-loading">Generating summary...</p>
        ) : (
          <p className="summary-text">{summary}</p>
        )}
        <Link to={`/chat/${chatId}`} className="summary-back-btn">← Back to Chat</Link>
      </div>
    </div>
  );
};

export default SummaryPage;
