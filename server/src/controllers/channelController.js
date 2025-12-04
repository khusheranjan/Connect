import Room from '../models/Room.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

// Get all channels
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Room.find()
      .populate('admin', 'username name avatar')
      .populate('members', 'username name avatar')
      .sort({ createdAt: -1 });

    const channelsWithMemberCount = channels.map(channel => ({
      _id: channel._id,
      name: channel.name,
      admin: channel.admin,
      memberCount: channel.members.length,
      members: channel.members,
      createdAt: channel.createdAt,
      isMember: channel.members.some(member => member._id.toString() === req.user.userId)
    }));

    res.status(200).json({
      message: "Channels retrieved successfully",
      data: channelsWithMemberCount
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve channels" });
  }
};

// Get channels the user is a member of
export const getMyChannels = async (req, res) => {
  try {
    const userId = req.user.userId;

    const channels = await Room.find({
      members: userId
    })
      .populate('admin', 'username name avatar')
      .populate('members', 'username name avatar')
      .sort({ createdAt: -1 });

    const channelsWithMemberCount = channels.map(channel => ({
      _id: channel._id,
      name: channel.name,
      admin: channel.admin,
      memberCount: channel.members.length,
      createdAt: channel.createdAt
    }));

    res.status(200).json({
      message: "Your channels retrieved successfully",
      data: channelsWithMemberCount
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve your channels" });
  }
};

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // Check if channel with same name exists
    const existingChannel = await Room.findOne({ name: name.trim() });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel with this name already exists" });
    }

    const channel = await Room.create({
      name: name.trim(),
      admin: userId,
      members: [userId],
      messages: []
    });

    const populatedChannel = await Room.findById(channel._id)
      .populate('admin', 'username name avatar')
      .populate('members', 'username name avatar');

    res.status(201).json({
      message: "Channel created successfully",
      data: populatedChannel
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create channel" });
  }
};

// Get channel details including members
export const getChannelDetails = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Room.findById(channelId)
      .populate('admin', 'username name avatar')
      .populate('members', 'username name avatar');

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({
      message: "Channel details retrieved successfully",
      data: {
        _id: channel._id,
        name: channel.name,
        admin: channel.admin,
        members: channel.members,
        memberCount: channel.members.length,
        createdAt: channel.createdAt,
        isMember: channel.members.some(member => member._id.toString() === req.user.userId)
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve channel details" });
  }
};

// Join a channel
export const joinChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Room.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if already a member
    if (channel.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this channel" });
    }

    channel.members.push(userId);
    await channel.save();

    const populatedChannel = await Room.findById(channel._id)
      .populate('admin', 'username name avatar')
      .populate('members', 'username name avatar');

    res.status(200).json({
      message: "Successfully joined the channel",
      data: populatedChannel
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to join channel" });
  }
};

// Leave a channel
export const leaveChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Room.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if user is a member
    if (!channel.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this channel" });
    }

    // Admin cannot leave their own channel
    if (channel.admin.toString() === userId) {
      return res.status(400).json({ message: "Channel admin cannot leave. Delete the channel instead." });
    }

    channel.members = channel.members.filter(memberId => memberId.toString() !== userId);
    await channel.save();

    res.status(200).json({
      message: "Successfully left the channel"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to leave channel" });
  }
};

// Delete a channel (admin only)
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Room.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Only admin can delete
    if (channel.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only the channel admin can delete this channel" });
    }

    await Room.findByIdAndDelete(channelId);

    res.status(200).json({
      message: "Channel deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete channel" });
  }
};

// Get channel messages
export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Room.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if user is a member
    if (!channel.members.includes(userId)) {
      return res.status(403).json({ message: "You must be a member to view messages" });
    }

    const messages = await Message.find({
      _id: { $in: channel.messages }
    })
      .populate('sender', 'username name avatar')
      .sort({ timestamp: 1 });

    res.status(200).json({
      message: "Channel messages retrieved successfully",
      data: messages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve channel messages" });
  }
};

// Send message to channel
export const sendChannelMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const channel = await Room.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if user is a member
    if (!channel.members.includes(userId)) {
      return res.status(403).json({ message: "You must be a member to send messages" });
    }

    const message = await Message.create({
      sender: userId,
      content: content.trim(),
      timestamp: new Date()
    });

    channel.messages.push(message._id);
    await channel.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username name avatar');

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
