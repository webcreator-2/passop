const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb'); 
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
    // res.json(findResult)
    res.json(passwords)
})

// Save a password
// app.post('/passwords',authMiddleware, async (req, res) => { 
//     const password = req.body
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.insertOne(password);
//     res.send({success: true, result: findResult})
// })
app.post("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const newPassword = { ...req.body, userId: req.user.id };
  const result = await collection.insertOne(newPassword);
  res.json({ success: true, result });
});

// Delete a password by id
// app.delete('/passwords',authMiddleware, async (req, res) => { 
//     const password = req.body
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.deleteOne(password);
//     res.send({success: true, result: findResult})
// })

app.delete("/passwords", authMiddleware, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body.id),
    userId: req.user.id,
  });
  res.json({ success: true, result });
});


app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})