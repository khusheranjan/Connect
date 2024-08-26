import User from '../models/User.js';
import Profile from '../models/Profile.js';
import jwt from 'jsonwebtoken';

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

    const user = await User.create({
      email,
      password,
      username,
      name,
      avatar,
      bio
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
        avatar: user.avatar,
        bio: user.bio
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
  
    if(user.password !== password){
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
        userProfile: user.userProfile,
      }
     })

  } catch (error) {
    console.log(error);
    res.send("Unable to login");
  }

}

// to setup profile

export const profile= async (req, res)=>{

  const {user_id, username, name, avatar, bio} = req.body;

  try {
    if(!username) return res.send("Username cant be empty");

    const Username= await Profile.findOne({username});
    if(Username) return res.send("Username is already taken");

    const profile= await Profile.create({
      username,
      name, 
      avatar,
      bio,
      user: user_id
    })
    
    const profileSetUp= await User.findByIdAndUpdate({user_id, userProfile:true})
    res.send("Profile is setup!")
    
  } catch (error) {
    console.log(error);
    res.send("Failed to upload profile")
  }
}