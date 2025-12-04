import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSocket from '../Context';

const apiUrl = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [channels, setChannels] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const { selectedUser, setSelectedUser, userData, onlineUsers } = useSocket();

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
    fetchChannels();
    fetchMyChannels();

    const interval = setInterval(() => {
      fetchPendingRequests();
      if (activeTab === 'channels') {
        fetchChannels();
        fetchMyChannels();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${apiUrl}/friends`, {
        withCredentials: true
      });
      setFriends(response.data.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${apiUrl}/friends/pending`, {
        withCredentials: true
      });
      setPendingRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/channels`, {
        withCredentials: true
      });
      setChannels(response.data.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMyChannels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/channels/my`, {
        withCredentials: true
      });
      setMyChannels(response.data.data);
    } catch (error) {
      console.error('Error fetching my channels:', error);
    }
  };

  const createChannel = async () => {
    if (!newChannelName.trim()) {
      alert('Please enter a channel name');
      return;
    }

    try {
      await axios.post(`${apiUrl}/channels/create`, {
        name: newChannelName
      }, {
        withCredentials: true
      });
      alert('Channel created successfully!');
      setNewChannelName('');
      setShowCreateChannel(false);
      fetchChannels();
      fetchMyChannels();
    } catch (error) {
      console.error('Error creating channel:', error);
      alert(error.response?.data?.message || 'Failed to create channel');
    }
  };

  const joinChannel = async (channelId) => {
    try {
      await axios.post(`${apiUrl}/channels/${channelId}/join`, {}, {
        withCredentials: true
      });
      alert('Joined channel successfully!');
      fetchChannels();
      fetchMyChannels();
    } catch (error) {
      console.error('Error joining channel:', error);
      alert(error.response?.data?.message || 'Failed to join channel');
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/users/search?query=${query}`, {
        withCredentials: true
      });
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`${apiUrl}/friends/request`, {
        recipientId: userId
      }, {
        withCredentials: true
      });
      alert('Friend request sent!');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`${apiUrl}/friends/accept/${requestId}`, {}, {
        withCredentials: true
      });
      alert('Friend request accepted!');
      fetchPendingRequests();
      fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert(error.response?.data?.message || 'Failed to accept friend request');
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await axios.post(`${apiUrl}/friends/reject/${requestId}`, {}, {
        withCredentials: true
      });
      alert('Friend request rejected');
      fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      alert(error.response?.data?.message || 'Failed to reject friend request');
    }
  };

  return (
    <div style={{
      width: '320px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e4e6eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: '#f0f2f5',
        borderBottom: '1px solid #e4e6eb'
      }}>
        <button
          onClick={() => setActiveTab('friends')}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: activeTab === 'friends' ? '#ffffff' : 'transparent',
            color: activeTab === 'friends' ? '#1877f2' : '#65676b',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            borderBottom: activeTab === 'friends' ? '3px solid #1877f2' : '3px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: activeTab === 'channels' ? '#ffffff' : 'transparent',
            color: activeTab === 'channels' ? '#1877f2' : '#65676b',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            borderBottom: activeTab === 'channels' ? '3px solid #1877f2' : '3px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          Channels
        </button>
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <>
          {/* Search and Requests Header */}
          <div style={{ padding: '12px', borderBottom: '1px solid #e4e6eb', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #ccd0d5',
                  borderRadius: '20px',
                  fontSize: '14px',
                  backgroundColor: '#f0f2f5'
                }}
              />
              <button
                onClick={() => setShowRequests(!showRequests)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: pendingRequests.length > 0 ? '#e74c3c' : '#f0f2f5',
                  color: pendingRequests.length > 0 ? 'white' : '#050505',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                {pendingRequests.length > 0 ? `${pendingRequests.length}` : '0'}
              </button>
            </div>
          </div>

          {/* Pending Requests */}
          {showRequests && pendingRequests.length > 0 && (
            <div style={{
              padding: '12px',
              borderBottom: '1px solid #e4e6eb',
              maxHeight: '250px',
              overflowY: 'auto',
              backgroundColor: '#fffbf0'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#050505' }}>
                Friend Requests
              </h3>
              {pendingRequests.map((request) => (
                <div key={request._id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e4e6eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#1877f2',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {request.requester.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{request.requester.name}</div>
                      <div style={{ fontSize: '12px', color: '#65676b' }}>@{request.requester.username}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => acceptFriendRequest(request._id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#42b72a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(request._id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#f0f2f5',
                        color: '#050505',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div style={{
              padding: '12px',
              borderBottom: '1px solid #e4e6eb',
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: '#f0f2f5'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600' }}>Search Results</h3>
              {searchResults.map((user) => (
                <div key={user._id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#65676b' }}>@{user.username}</div>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(user._id)}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: '#1877f2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Friends List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#050505' }}>
              Messages
            </h3>
            {friends.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#65676b', textAlign: 'center', marginTop: '20px' }}>
                No friends yet. Search and add friends above!
              </p>
            ) : (
              friends.map((friend) => {
                const isOnline = onlineUsers && onlineUsers.has(friend._id);
                return (
                  <div
                    key={friend._id}
                    onClick={() => setSelectedUser(friend)}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      backgroundColor: selectedUser?._id === friend._id ? '#e7f3ff' : 'transparent',
                      marginBottom: '4px',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedUser?._id !== friend._id) {
                        e.currentTarget.style.backgroundColor = '#f0f2f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedUser?._id !== friend._id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#1877f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}>
                        {friend.name[0].toUpperCase()}
                      </div>
                      <span
                        className={isOnline ? 'online-badge' : 'offline-badge'}
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '12px',
                          height: '12px'
                        }}
                      ></span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '15px',
                        color: '#050505',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {friend.name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: isOnline ? '#42b72a' : '#65676b',
                        fontWeight: isOnline ? '500' : '400'
                      }}>
                        {isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <>
          {/* Channel Header */}
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #e4e6eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#050505' }}>
              My Channels
            </h3>
            <button
              onClick={() => setShowCreateChannel(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#42b72a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              + Create
            </button>
          </div>

          {/* Create Channel Form */}
          {showCreateChannel && (
            <div style={{
              padding: '12px',
              borderBottom: '1px solid #e4e6eb',
              backgroundColor: '#f0f2f5'
            }}>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Enter channel name..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '8px',
                  border: '1px solid #ccd0d5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={createChannel}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#42b72a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => { setShowCreateChannel(false); setNewChannelName(''); }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#ffffff',
                    color: '#050505',
                    border: '1px solid #ccd0d5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Channels List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {myChannels.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#65676b', textAlign: 'center', marginTop: '20px' }}>
                No channels yet. Create or join one!
              </p>
            ) : (
              myChannels.map((channel) => (
                <div
                  key={channel._id}
                  onClick={() => setSelectedUser({ ...channel, isChannel: true })}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    backgroundColor: selectedUser?._id === channel._id && selectedUser?.isChannel ? '#e7f3ff' : 'transparent',
                    marginBottom: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!(selectedUser?._id === channel._id && selectedUser?.isChannel)) {
                      e.currentTarget.style.backgroundColor = '#f0f2f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(selectedUser?._id === channel._id && selectedUser?.isChannel)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#050505' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#65676b' }}>
                    {channel.memberCount} members
                  </div>
                </div>
              ))
            )}

            {/* Available Channels */}
            <div style={{
              marginTop: '20px',
              paddingTop: '12px',
              borderTop: '1px solid #e4e6eb'
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '15px',
                fontWeight: '600',
                color: '#050505'
              }}>
                Discover
              </h4>
              {channels.filter(ch => !ch.isMember).length === 0 ? (
                <p style={{ fontSize: '13px', color: '#65676b', textAlign: 'center' }}>
                  You've joined all channels!
                </p>
              ) : (
                channels.filter(ch => !ch.isMember).map((channel) => (
                  <div
                    key={channel._id}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderRadius: '12px',
                      backgroundColor: '#f0f2f5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#050505' }}>
                        # {channel.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#65676b' }}>
                        {channel.memberCount} members
                      </div>
                    </div>
                    <button
                      onClick={() => joinChannel(channel._id)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#1877f2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
