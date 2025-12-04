import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username name avatar')
      .populate('receiver', 'username name avatar');

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get conversation history between two users
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'username name avatar')
      .populate('receiver', 'username name avatar')
      .sort({ timestamp: 1 });

    res.status(200).json({
      message: "Conversation retrieved successfully",
      data: messages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve conversation" });
  }
};

// Get all conversations for the current user
export const getAllConversations = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    })
      .populate('sender', 'username name avatar')
      .populate('receiver', 'username name avatar')
      .sort({ timestamp: -1 });

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === currentUserId
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();

      if (!conversationsMap.has(partnerId)) {
        const partner = msg.sender._id.toString() === currentUserId
          ? msg.receiver
          : msg.sender;

        conversationsMap.set(partnerId, {
          partner,
          lastMessage: msg,
          messages: []
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      message: "Conversations retrieved successfully",
      data: conversations
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve conversations" });
  }
};
