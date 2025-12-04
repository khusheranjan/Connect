import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// jwt token creation
const maxAge= 3*24*60*60*1000;
const createToken = (user) => {
  const { email, id, username, name } = user;

  return jwt.sign(
    { email, userId: id, username, name },
    process.env.JWT_KEY,
    { expiresIn: maxAge }
  );
};


// to register user

export const register = async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered!" });
    }

    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
    });

    res.cookie("jwt", createToken(user), {
      maxAge,
      secure: true,
      sameSite: "None"
    });

    return res.status(201).json({
      message: "User successfully registered!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// to login user

export const login= async (req, res)=>{

  const {email, password} = req.body;

  try {
    
    const user= await User.findOne({email});

    if(!user){
        return res.status(404).json({ message: "User not found"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({ message: "Invalid password" });
    }
  
    res.cookie("jwt", createToken(user), {
      maxAge,
      secure: true,
      sameSite: "None"
    })
  
    return res.status(201).json({
      message: "User logined!",
      user:{
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      }
     })

  } catch (error) {
    console.log(error);
    res.send("Unable to login");
  }

}

// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const user = await User.findById(user_id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve profile" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const {username, name, avatar, bio} = req.body;
  const user_id = req.user.userId;

  try {
    if(!username) return res.status(400).json({ message: "Username cant be empty" });

    const existingUser= await User.findOne({username});
    if(existingUser && existingUser._id.toString() !== user_id) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { username, name, avatar, bio },
      { new: true }
    );

    res.status(200).json({
      message: "Profile is updated!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

// Legacy function for backwards compatibility
export const profile = updateProfile;

// Search users by username or name
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.userId;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    })
      .select('username name avatar bio')
      .limit(20);

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to search users" });
  }
}

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('username name avatar bio');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve user" });
  }
}