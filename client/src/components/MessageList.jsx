import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <div style={{ flex: 1, padding: '10px', overflowY: 'scroll' }}>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}:</strong> {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
