import User from '../models/User.js';

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
