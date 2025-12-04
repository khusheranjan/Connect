# Connect - Real-time Chat Application

A full-stack real-time chat application with direct messaging, channels, friend management, and typing indicators.

## Tech Stack Used

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** with **Vite** - UI library and build tool
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time client
- **Axios** - HTTP client
- **Context API** - State management

## Setup and Run Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/connect-chat
JWT_KEY=your-secret-jwt-key-change-this-in-production
ORIGIN=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in client directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

### Database Setup

Ensure MongoDB is running:
- **Local**: Run `mongod` command
- **Cloud**: Use MongoDB Atlas connection string
- **Docker**: `docker run -d -p 27017:27017 mongo`

## Features

### Core Features
- **User Authentication** - Registration, login with JWT tokens
- **Real-time Direct Messaging** - One-to-one chat with Socket.io
- **Friend System** - Send, accept, reject friend requests
- **Channel/Group Chat** - Create and join public channels
- **User Search** - Find users by username or name
- **Profile Management** - Update username, name, bio, avatar
- **Online Status** - See who's online in real-time
- **Message History** - Persistent message storage

### Optional Features Implemented
- **✅ Typing Indicator** - Real-time typing indicators in direct messages
  - Shows "{username} is typing..." with animated dots
  - Auto-dismisses after 2 seconds of inactivity
  - Clears when message is sent
  - Only works for direct messages (not channels)

## Assumptions or Limitations

### Assumptions
- Users must be friends to send direct messages
- Channels are public and any user can join
- JWT tokens expire after 3 days
- Passwords are hashed with bcrypt (10 salt rounds)
- Messages are stored indefinitely (no auto-deletion)

### Current Limitations
- **No pagination** - All messages and friend lists load at once
- **No file uploads** - Text-only messages (avatar uses URL)
- **No message editing/deletion** - Messages are permanent once sent
- **No read receipts** - Can't see if messages were read
- **No notifications** - No system for friend request/message notifications
- **Channel typing indicator** - Not implemented for group chats
- **No offline message queue** - Messages only sent when both users online
- **Session management** - Single device login (no multi-device sync)
- **Avatar upload** - Only URL input supported, no direct file upload

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /profile` - Update profile (protected)

### Users
- `GET /users/search?query=<query>` - Search users (protected)
- `GET /users/:userId` - Get user by ID (protected)

### Messages
- `POST /messages/send` - Send message (protected)
- `GET /messages/conversation/:userId` - Get conversation (protected)

### Friends
- `POST /friends/request` - Send friend request (protected)
- `POST /friends/accept/:requestId` - Accept request (protected)
- `POST /friends/reject/:requestId` - Reject request (protected)
- `GET /friends/pending` - Get pending requests (protected)
- `GET /friends` - Get friends list (protected)

### Channels
- `POST /channels/create` - Create channel (protected)
- `GET /channels` - Get all channels (protected)
- `GET /channels/my` - Get user's channels (protected)
- `GET /channels/:id` - Get channel details (protected)
- `GET /channels/:id/messages` - Get channel messages (protected)
- `POST /channels/:id/join` - Join channel (protected)
- `POST /channels/:id/leave` - Leave channel (protected)

## Socket.io Events

### Client → Server
- `sendMessage` - Send direct message
- `sendChannelMessage` - Send channel message
- `typing` - Emit typing status
- `joinChannel` - Join channel room

### Server → Client
- `receiveMessage` - Receive direct message
- `receiveChannelMessage` - Receive channel message
- `userTyping` - Receive typing status
- `userOnline` - User comes online
- `userOffline` - User goes offline

## Project Structure

```
Connect/
├── server/
│   ├── server.js                      # Main server with Socket.io
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── userController.js      # Auth & user operations
│   │   │   ├── messageController.js   # Message operations
│   │   │   ├── friendController.js    # Friend operations
│   │   │   └── channelController.js   # Channel operations
│   │   ├── models/
│   │   │   ├── User.js                # User schema
│   │   │   ├── Message.js             # Message schema
│   │   │   ├── Friends.js             # Friendship schema
│   │   │   ├── Request.js             # Friend request schema
│   │   │   └── Room.js                # Channel schema
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js      # JWT verification
│   │   └── routes/
│   │       └── routes.js              # API routes
│   └── .env
└── client/
    ├── src/
    │   ├── App.jsx                    # Main app with routing
    │   ├── Context.jsx                # Socket & state management
    │   ├── pages/
    │   │   ├── Landing/Landing.jsx    # Landing page
    │   │   ├── Login/Login.jsx        # Login page
    │   │   ├── Register/Register.jsx  # Registration page
    │   │   ├── Dashboard/Dashboard.jsx # Main chat interface
    │   │   └── Profile/Profile.jsx    # Profile settings
    │   └── components/
    │       ├── ChatArea.jsx           # Chat display
    │       ├── MessageList.jsx        # Message rendering
    │       ├── MessageInput.jsx       # Message input with typing
    │       └── Sidebar.jsx            # Friends & channels sidebar
    └── .env.local
```

## Usage

1. **Register** - Create account with email, password, username, and name
2. **Login** - Sign in with credentials
3. **Add Friends** - Search users and send friend requests
4. **Accept Requests** - Check pending requests in sidebar
5. **Direct Chat** - Click friend to start messaging
6. **Join Channels** - Browse and join public channels
7. **Create Channel** - Create your own public channel
8. **Update Profile** - Edit profile information and avatar

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication (3-day expiration)
- HTTP-only cookies for secure token storage
- Protected API routes with authentication middleware
- CORS configuration for cross-origin requests
- Input validation and sanitization

## Future Enhancements

- Message editing and deletion
- File and image sharing
- Read receipts and message status
- Push notifications
- Video/voice calls
- Message reactions and emojis
- Dark mode theme
- Message pagination
- Multi-device support
- Offline message queue

## License

MIT License - Open source and free to use.
