const authMiddleware = require("./authMiddleware");

// Get all passwords for logged-in user
app.get("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const passwords = await collection.find({ userId: req.user.id }).toArray();
  res.json(passwords);
});

// Add a new password for logged-in user
app.post("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const password = { ...req.body, userId: req.user.id }; // link to user
  const result = await collection.insertOne(password);

  res.json({ success: true, result });
});

// Delete password (only if it belongs to logged-in user)
app.delete("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const result = await collection.deleteOne({ _id: new ObjectId(req.body.id), userId: req.user.id });

  res.json({ success: true, result });
});
