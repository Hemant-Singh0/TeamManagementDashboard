const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log("data::::::::::::::", req.body);
  const { email, password, role, name } = req.body;

  try {
    // Fixed duplicate check
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name || "Guest",
      email,
      password: hashedPassword,
      role: role || "owner",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, user: newUser },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        id: user.id,
      },
      token,
    });
  } catch (err) {
    console.error("err:::",err);
    res.status(500).json({ message: "Server error" });
  }
};

