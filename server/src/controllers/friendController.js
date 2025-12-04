import Request from '../models/Request.js';
import Friends from '../models/Friends.js';
import User from '../models/User.js';

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user.userId;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    if (requesterId === recipientId) {
      return res.status(400).json({ message: "Cannot send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    const alreadyFriends = await Friends.findOne({
      $or: [
        { user1: requesterId, user2: recipientId },
        { user1: recipientId, user2: requesterId }
      ]
    });

    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends with this user" });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = await Request.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    const populatedRequest = await Request.findById(friendRequest._id)
      .populate('requester', 'username name avatar')
      .populate('recipient', 'username name avatar');

    res.status(201).json({
      message: "Friend request sent successfully",
      data: populatedRequest
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send friend request" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const friendRequest = await Request.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: "Friend request already processed" });
    }

    // Update request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Create friendship
    await Friends.create({
      user1: friendRequest.requester,
      user2: friendRequest.recipient
    });

    const populatedRequest = await Request.findById(friendRequest._id)
      .populate('requester', 'username name avatar')
      .populate('recipient', 'username name avatar');

    res.status(200).json({
      message: "Friend request accepted",
      data: populatedRequest
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to accept friend request" });
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const friendRequest = await Request.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: "Friend request already processed" });
    }

    friendRequest.status = 'rejected';
    await friendRequest.save();

    const populatedRequest = await Request.findById(friendRequest._id)
      .populate('requester', 'username name avatar')
      .populate('recipient', 'username name avatar');

    res.status(200).json({
      message: "Friend request rejected",
      data: populatedRequest
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to reject friend request" });
  }
};

// Get pending friend requests for the current user
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await Request.find({
      recipient: userId,
      status: 'pending'
    })
      .populate('requester', 'username name avatar')
      .populate('recipient', 'username name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Pending requests retrieved successfully",
      data: requests
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve pending requests" });
  }
};

// Get all friends for the current user
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const friendships = await Friends.find({
      $or: [{ user1: userId }, { user2: userId }]
    })
      .populate('user1', 'username name avatar')
      .populate('user2', 'username name avatar');

    const friends = friendships.map(friendship => {
      return friendship.user1._id.toString() === userId
        ? friendship.user2
        : friendship.user1;
    });

    res.status(200).json({
      message: "Friends retrieved successfully",
      data: friends
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve friends" });
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.userId;

    const friendship = await Friends.findOneAndDelete({
      $or: [
        { user1: userId, user2: friendId },
        { user1: friendId, user2: userId }
      ]
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    res.status(200).json({
      message: "Friend removed successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};
