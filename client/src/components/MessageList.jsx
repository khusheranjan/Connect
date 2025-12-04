import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId, isChannel }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
      {messages.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
          No messages yet. Start the conversation!
        </p>
      ) : (
        messages.map((message, index) => {
          const isCurrentUser = message.sender._id === currentUserId || message.sender === currentUserId;
          const senderName = message.sender.name || message.sender.username || 'Unknown';
          const showSenderName = isChannel || !isCurrentUser;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                marginBottom: '12px'
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  backgroundColor: isCurrentUser ? '#0084ff' : '#e4e6eb',
                  color: isCurrentUser ? 'white' : 'black',
                }}
              >
                {showSenderName && (
                  <div style={{
                    fontSize: '11px',
                    marginBottom: '4px',
                    opacity: 0.8,
                    fontWeight: '600'
                  }}>
                    {isCurrentUser && isChannel ? 'You' : senderName}
                  </div>
                )}
                <div style={{ wordBreak: 'break-word' }}>{message.content}</div>
                <div
                  style={{
                    fontSize: '10px',
                    marginTop: '4px',
                    opacity: 0.7,
                    textAlign: 'right'
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
