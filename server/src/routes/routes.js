import express from 'express';
import { login, profile, register, searchUsers, getUserById, getProfile, updateProfile } from '../controllers/userController.js';
import { sendMessage, getConversation, getAllConversations } from '../controllers/messageController.js';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getPendingRequests, getFriends, removeFriend } from '../controllers/friendController.js';
import { getAllChannels, getMyChannels, createChannel, getChannelDetails, joinChannel, leaveChannel, deleteChannel, getChannelMessages, sendChannelMessage } from '../controllers/channelController.js';
import autheticated from '../middlewares/authMiddleware.js';

const router= express.Router();

// Landing page
router.get('/', (req, res) => {
  res.json({
    message: "Welcome to Connect API",
    version: "1.0.0",
    status: "active",
    description: "A real-time chat application with Socket.io, featuring direct messaging, group channels, and friend management.",
    documentation: {
      authentication: {
        "POST /register": "Register a new user",
        "POST /login": "Login user",
        "GET /profile": "Get user profile (protected)",
        "POST /profile": "Update user profile (protected)"
      },
      users: {
        "GET /users/search?query=<query>": "Search users (protected)",
        "GET /users/:userId": "Get user by ID (protected)"
      },
      messages: {
        "POST /messages/send": "Send a message (protected)",
        "GET /messages/conversation/:userId": "Get conversation with user (protected)",
        "GET /messages/conversations": "Get all conversations (protected)"
      },
      friends: {
        "POST /friends/request": "Send friend request (protected)",
        "POST /friends/accept/:requestId": "Accept friend request (protected)",
        "POST /friends/reject/:requestId": "Reject friend request (protected)",
        "GET /friends/pending": "Get pending requests (protected)",
        "GET /friends": "Get friends list (protected)",
        "DELETE /friends/remove/:friendId": "Remove friend (protected)"
      },
      channels: {
        "GET /channels": "Get all channels (protected)",
        "GET /channels/my": "Get user's channels (protected)",
        "POST /channels/create": "Create new channel (protected)",
        "GET /channels/:channelId": "Get channel details (protected)",
        "POST /channels/:channelId/join": "Join a channel (protected)",
        "POST /channels/:channelId/leave": "Leave a channel (protected)",
        "DELETE /channels/:channelId/delete": "Delete channel (protected)",
        "GET /channels/:channelId/messages": "Get channel messages (protected)",
        "POST /channels/:channelId/messages": "Send message to channel (protected)"
      }
    },
    websocket: {
      events: {
        client_to_server: [
          "sendMessage - Send a direct message",
          "sendChannelMessage - Send a message to a channel",
          "joinChannel - Join a channel room"
        ],
        server_to_client: [
          "receiveMessage - Receive a direct message",
          "receiveChannelMessage - Receive a channel message",
          "userOnline - User came online",
          "userOffline - User went offline"
        ]
      }
    },
    features: [
      "User Authentication (JWT)",
      "Real-time Direct Messaging",
      "Group Chat Channels",
      "Friend Management System",
      "Online/Offline Status",
      "User Search",
      "Profile Management"
    ],
    techStack: {
      backend: ["Node.js", "Express", "MongoDB", "Socket.io", "JWT", "bcrypt"],
      frontend: ["React", "Vite", "Socket.io Client", "Axios"]
    },
    github: "https://github.com/khusheranjan/Connect"
  });
});

// Auth routes
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/profile').get(autheticated, getProfile).post(autheticated, updateProfile)
router.route('/profile/update').post(autheticated, profile) // Legacy endpoint

// User routes
router.route('/users/search').get(autheticated, searchUsers)
router.route('/users/:userId').get(autheticated, getUserById)

// Message routes
router.route('/messages/send').post(autheticated, sendMessage)
router.route('/messages/conversation/:userId').get(autheticated, getConversation)
router.route('/messages/conversations').get(autheticated, getAllConversations)

// Friend routes
router.route('/friends/request').post(autheticated, sendFriendRequest)
router.route('/friends/accept/:requestId').post(autheticated, acceptFriendRequest)
router.route('/friends/reject/:requestId').post(autheticated, rejectFriendRequest)
router.route('/friends/pending').get(autheticated, getPendingRequests)
router.route('/friends').get(autheticated, getFriends)
router.route('/friends/remove/:friendId').delete(autheticated, removeFriend)

// Channel routes
router.route('/channels').get(autheticated, getAllChannels)
router.route('/channels/my').get(autheticated, getMyChannels)
router.route('/channels/create').post(autheticated, createChannel)
router.route('/channels/:channelId').get(autheticated, getChannelDetails)
router.route('/channels/:channelId/join').post(autheticated, joinChannel)
router.route('/channels/:channelId/leave').post(autheticated, leaveChannel)
router.route('/channels/:channelId/delete').delete(autheticated, deleteChannel)
router.route('/channels/:channelId/messages').get(autheticated, getChannelMessages)
router.route('/channels/:channelId/messages').post(autheticated, sendChannelMessage)

export default router;