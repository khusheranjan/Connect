import User from '../models/User.js';

// to register user

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = await User.create({
      email,
      password,
    });

    res.status(201).json({ message: "User successfully registered!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// to login user

export const login= async (req, res)=>{

  const {email, password} = req.body;

  const user= await User.findOne({email});

  if(!user){
      return res.status(404).json({ message: "User not found"})
  }

  if(User.password !== password){
      return res.send("Invalid password")
  }

  res.status(201).json({ message: "Login successful" })
}

// to logout user

export const logout= async (req, res)=>{

  await User.deleteOne({email});

}

// to setup profile

export const profile= async (req, res)=>{

  const {user_id, username, name, avatar, bio} = req.body;

  if(!username) return res.send()
}