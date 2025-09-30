const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME;
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(cors());

// =============================
// 🔑 Auth Middleware
// =============================
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// =============================
// 👤 Auth Routes
// =============================

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const db = client.db(dbName);
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ email, password: hashed });
  res.json({ success: true, message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = client.db(dbName);
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// =============================
// 🔐 Password Manager Routes
// =============================

// Get all passwords (for logged-in user only)
app.get("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.find({ userId: req.userId }).toArray();
  res.json(result);
});

// Save new password
app.post("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const data = { ...req.body, userId: req.userId };
  const result = await collection.insertOne(data);
  res.json({ success: true, result });
});

// Delete a password (only if belongs to user)
app.delete("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const { id } = req.body;

  const result = await collection.deleteOne({
    id: id,
    userId: req.userId,
  });

  res.json({ success: true, result });
});

// =============================
// 🚀 Start Server
// =============================
app.listen(port, async () => {
  await client.connect();
  console.log(`Server running at http://localhost:${port}`);
});
