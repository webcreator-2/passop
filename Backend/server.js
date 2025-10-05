const express = require('express')
const dotenv = require('dotenv')
const { MongoClient, ObjectId } = require('mongodb'); 
const bodyparser = require('body-parser')
const cors = require('cors')
const authRoutes = require('./authRoutes');
const authMiddleware = require('./authMiddleware');

dotenv.config()


// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();
console.log("Mongo connected")

// App & Database
const dbName = process.env.DB_NAME 
const app = express()
const port = 3000 

// Middleware
app.use(bodyparser.json())
app.use(cors())
app.use("/auth", authRoutes);

// Get all the passwords
app.get('/passwords',authMiddleware, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({userId: req.user.id}).toArray();
    res.json(findResult)

})
app.post("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const newPassword = { ...req.body, userId: req.user.id };
  const result = await collection.insertOne(newPassword);
  res.json({ success: true, result });
});

app.put('/passwords/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { site, username, password } = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId: req.user.id }, // ensure only user’s own password
      { $set: { site, username, password } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Password not found" });
    }

    res.json({ success: true, result: { _id: id, site, username, password } });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// Delete a password by id
// app.delete('/passwords',authMiddleware, async (req, res) => { 
//     const password = req.body
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.deleteOne(password);
//     res.send({success: true, result: findResult})
// })
// DELETE a password by id
app.delete('/passwords/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "No id provided" });
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');

        const result = await collection.deleteOne({
            _id: new ObjectId(id),
            userId: req.user.id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Password not found or not yours" });
        }

        res.json({ success: true, message: "Password deleted successfully" });
    } catch (err) {
        console.error("Error deleting password:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});




app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})

