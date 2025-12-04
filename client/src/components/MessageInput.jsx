import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      padding: '16px 20px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e4e6eb',
      gap: '12px',
      alignItems: 'center'
    }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '12px 16px',
          border: '1px solid #ccd0d5',
          borderRadius: '24px',
          fontSize: '15px',
          backgroundColor: '#f0f2f5',
          outline: 'none',
          transition: 'all 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = '#ffffff';
          e.target.style.borderColor = '#1877f2';
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = '#f0f2f5';
          e.target.style.borderColor = '#ccd0d5';
        }}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        style={{
          padding: '12px 24px',
          backgroundColor: message.trim() ? '#0084ff' : '#e4e6eb',
          color: message.trim() ? 'white' : '#bcc0c4',
          border: 'none',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: message.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          if (message.trim()) {
            e.target.style.backgroundColor = '#0073e6';
          }
        }}
        onMouseLeave={(e) => {
          if (message.trim()) {
            e.target.style.backgroundColor = '#0084ff';
          }
        }}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
