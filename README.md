# Connect - Real-time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Implemented Features ✅

- **User Authentication**
  - User registration with email and password
  - Secure login with JWT tokens
  - Password hashing with bcrypt
  - Cookie-based session management

- **Real-time Messaging**
  - One-to-one chat with Socket.io
  - Real-time message delivery
  - Message history persistence
  - Auto-scrolling message list
  - Timestamp display

- **Friend Management**
  - Send friend requests
  - Accept/reject friend requests
  - View friends list
  - Remove friends

- **User Features**
  - Search users by username or name
  - Profile management (username, name, bio, avatar)
  - User profile updates

- **UI/UX**
  - Clean and modern interface
  - Responsive chat bubbles
  - Friend selection sidebar
  - User search functionality
  - Profile settings page

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time client
- **Axios** - HTTP client

## Project Structure

```
Connect/
├── server/
│   ├── server.js                 # Main server file with Socket.io setup
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── userController.js       # Auth and user operations
│   │   │   ├── messageController.js    # Message operations
│   │   │   └── friendController.js     # Friend request operations
│   │   ├── models/
│   │   │   ├── User.js                 # User schema
│   │   │   ├── Message.js              # Message schema
│   │   │   ├── Friends.js              # Friendship schema
│   │   │   ├── Request.js              # Friend request schema
│   │   │   └── Room.js                 # Chat room schema (unused)
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js       # JWT authentication
│   │   └── routes/
│   │       └── routes.js               # API routes
│   └── .env                      # Environment variables
└── client/
    ├── src/
    │   ├── App.jsx               # Main app with routing
    │   ├── Context.jsx           # Socket and state management
    │   ├── pages/
    │   │   ├── Login/Login.jsx          # Login page
    │   │   ├── Register/Register.jsx    # Registration page
    │   │   ├── Dashboard/Dashboard.jsx  # Main chat interface
    │   │   └── Profile/Profile.jsx      # Profile settings
    │   └── components/
    │       ├── ChatArea.jsx      # Chat container
    │       ├── MessageList.jsx   # Message display
    │       ├── MessageInput.jsx  # Message input form
    │       └── Sidebar.jsx       # Friends list sidebar
    └── .env.local                # Client environment variables
```

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /profile` - Update user profile (protected)

### Users
- `GET /users/search?query=<query>` - Search users (protected)
- `GET /users/:userId` - Get user by ID (protected)

### Messages
- `POST /messages/send` - Send a message (protected)
- `GET /messages/conversation/:userId` - Get conversation with user (protected)
- `GET /messages/conversations` - Get all conversations (protected)

### Friends
- `POST /friends/request` - Send friend request (protected)
- `POST /friends/accept/:requestId` - Accept friend request (protected)
- `POST /friends/reject/:requestId` - Reject friend request (protected)
- `GET /friends/pending` - Get pending requests (protected)
- `GET /friends` - Get friends list (protected)
- `DELETE /friends/remove/:friendId` - Remove friend (protected)

## Socket.io Events

### Client to Server
- `sendMessage` - Send a message to another user

### Server to Client
- `receiveMessage` - Receive a new message

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/connect-chat
JWT_KEY=your-secret-jwt-key-change-this-in-production
ORIGIN=http://localhost:5173
```

4. Start the server:
```bash
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### MongoDB Setup

Make sure MongoDB is running on your system. You can:
- Install MongoDB locally and run `mongod`
- Use MongoDB Atlas (cloud database)
- Use Docker: `docker run -d -p 27017:27017 mongo`

## Usage

1. **Register**: Create a new account with email, password, username, and name
2. **Login**: Sign in with your credentials
3. **Search Friends**: Use the search bar in the sidebar to find users
4. **Add Friends**: Send friend requests to users you want to chat with
5. **Accept Requests**: Check pending friend requests and accept them
6. **Start Chatting**: Select a friend from the sidebar and start messaging
7. **Update Profile**: Click the Profile button to update your information

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for authentication (3-day expiration)
- HTTP-only cookies for token storage
- Protected API routes with authentication middleware
- Input validation and sanitization

## Future Enhancements

Potential features to add:
- Group chat rooms
- Message editing and deletion
- File/image sharing
- Read receipts
- Typing indicators
- Online/offline status
- Push notifications
- Video/voice calls
- Message reactions
- Dark mode

## Known Issues

- Chat rooms (Room model) are defined but not implemented in the UI
- No friend request notification system
- No pagination for messages or conversations
- Avatar uploads not implemented (only URL input)

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

This project is open source and available under the MIT License.
