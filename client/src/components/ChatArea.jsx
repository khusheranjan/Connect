import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useSocket from '../Context';

const apiUrl = import.meta.env.VITE_API_URL;

const ChatArea = () => {
  const { selectedUser, messages, setMessages, socket, userData, onlineUsers, typingUsers } = useSocket();
  const [conversationMessages, setConversationMessages] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const isChannel = selectedUser?.isChannel;
  const isOnline = onlineUsers && selectedUser && onlineUsers.has(selectedUser._id);
  const isTyping = !isChannel && selectedUser && typingUsers[selectedUser._id];

  useEffect(() => {
    if (selectedUser) {
      setConversationMessages([]);
      loadConversation();
      if (isChannel) {
        loadChannelDetails();
        joinChannelSocket();
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    const handleDirectMessage = (message) => {
      if (!selectedUser || isChannel) return;

      const isSender = message.sender._id === userData.id || message.sender === userData.id;
      const isReceiver = message.receiver._id === userData.id || message.receiver === userData.id;
      const isSenderToSelected = message.sender._id === selectedUser._id || message.sender === selectedUser._id;
      const isReceiverFromSelected = message.receiver._id === selectedUser._id || message.receiver === selectedUser._id;

      if ((isSender && isReceiverFromSelected) || (isReceiver && isSenderToSelected)) {
        setConversationMessages(prev => [...prev, message]);
      }
    };

    const handleChannelMessage = (data) => {
      if (!selectedUser || !isChannel) return;

      if (data.channelId === selectedUser._id) {
        setConversationMessages(prev => [...prev, data.message]);
      }
    };

    socket.on('receiveMessage', handleDirectMessage);
    socket.on('receiveChannelMessage', handleChannelMessage);

    return () => {
      socket.off('receiveMessage', handleDirectMessage);
      socket.off('receiveChannelMessage', handleChannelMessage);
    };
  }, [socket, selectedUser, userData, isChannel]);

  const joinChannelSocket = () => {
    if (socket && selectedUser?.isChannel) {
      socket.emit('joinChannel', {
        channelId: selectedUser._id,
        userId: userData.id
      });
    }
  };

  const loadConversation = async () => {
    try {
      if (isChannel) {
        const response = await axios.get(`${apiUrl}/channels/${selectedUser._id}/messages`, {
          withCredentials: true
        });
        setConversationMessages(response.data.data);
      } else {
        const response = await axios.get(`${apiUrl}/messages/conversation/${selectedUser._id}`, {
          withCredentials: true
        });
        setConversationMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const loadChannelDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/channels/${selectedUser._id}`, {
        withCredentials: true
      });
      setChannelMembers(response.data.data.members);
    } catch (error) {
      console.error('Error loading channel details:', error);
    }
  };

  const handleSendMessage = (messageText) => {
    if (!socket || !selectedUser) {
      console.error('Socket not connected or no user selected');
      return;
    }

    if (isChannel) {
      const messageData = {
        channelId: selectedUser._id,
        senderId: userData.id,
        content: messageText
      };

      socket.emit('sendChannelMessage', messageData);
    } else {
      const messageData = {
        sender: userData.id,
        receiver: selectedUser._id,
        content: messageText
      };

      socket.emit('sendMessage', messageData);
    }
  };

  const leaveChannel = async () => {
    try {
      await axios.post(`${apiUrl}/channels/${selectedUser._id}/leave`, {}, {
        withCredentials: true
      });
      alert('Left channel successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error leaving channel:', error);
      alert(error.response?.data?.message || 'Failed to leave channel');
    }
  };

  if (!selectedUser) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#f0f2f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px'
        }}>
          💬
        </div>
        <p style={{
          color: '#65676b',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          Select a chat to start messaging
        </p>
        <p style={{
          color: '#8a8d91',
          fontSize: '14px'
        }}>
          Choose from your existing conversations or start a new one
        </p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e4e6eb',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isChannel && (
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#1877f2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {selectedUser.name[0].toUpperCase()}
              </div>
              <span
                className={isOnline ? 'online-badge' : 'offline-badge'}
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '14px',
                  height: '14px'
                }}
              ></span>
            </div>
          )}
          {isChannel && (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#f0f2f5',
              color: '#1877f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              #
            </div>
          )}
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '600',
              color: '#050505'
            }}>
              {isChannel ? selectedUser.name : selectedUser.name}
            </h3>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '13px',
              color: '#65676b'
            }}>
              {isChannel ? (
                `${channelMembers.length} members`
              ) : (
                <span style={{ color: isOnline ? '#42b72a' : '#65676b' }}>
                  {isOnline ? 'Active now' : 'Offline'}
                </span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isChannel && (
            <>
              <button
                onClick={() => setShowMembers(!showMembers)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#f0f2f5',
                  color: '#050505',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f2f5'}
              >
                {showMembers ? 'Hide' : 'Show'} Members
              </button>
              <button
                onClick={leaveChannel}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#f0f2f5',
                  color: '#e74c3c',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fee'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f2f5'}
              >
                Leave
              </button>
            </>
          )}
        </div>
      </div>

      {/* Channel Members List */}
      {isChannel && showMembers && (
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #e4e6eb',
          backgroundColor: '#f9fafb',
          maxHeight: '120px',
          overflowY: 'auto'
        }}>
          <strong style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#050505',
            marginBottom: '10px',
            display: 'block'
          }}>
            Members ({channelMembers.length})
          </strong>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {channelMembers.map((member) => (
              <div
                key={member._id}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e6eb',
                  borderRadius: '16px',
                  fontSize: '13px',
                  color: '#050505',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#1877f2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {member.name[0].toUpperCase()}
                </div>
                {member.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <MessageList messages={conversationMessages} currentUserId={userData?.id} isChannel={isChannel} />

      {/* Typing Indicator */}
      {isTyping && (
        <div style={{
          padding: '8px 20px',
          backgroundColor: '#fafafa',
          borderTop: '1px solid #e4e6eb',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}>
            <div className="typing-dot" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#0084ff',
              animation: 'typingAnimation 1.4s infinite'
            }}></div>
            <div className="typing-dot" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#0084ff',
              animation: 'typingAnimation 1.4s infinite 0.2s'
            }}></div>
            <div className="typing-dot" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#0084ff',
              animation: 'typingAnimation 1.4s infinite 0.4s'
            }}></div>
          </div>
          <span style={{
            fontSize: '13px',
            color: '#65676b',
            fontStyle: 'italic'
          }}>
            {selectedUser.name} is typing...
          </span>
        </div>
      )}

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatArea;
