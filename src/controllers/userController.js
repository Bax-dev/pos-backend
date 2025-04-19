const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const register = async (req, res) => {
  try {
    console.log("Register API called with data:", req.body);
    
    const { username, email, password } = req.body;
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

const login = async (req, res) => {
  try {
    console.log("Login API called with:", req.body);
    
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password"] } // hide passwords
    });

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};


module.exports = { register, login, getAllUsers };
