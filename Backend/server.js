const express = require('express')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

const url = process.env.MONGO_URI;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, // <-- ensures TLS is used
});


const dbName = process.env.DB_NAME;
const app = express()

const port = process.env.PORT || 3000; 

app.use(bodyparser.json());
app.use(cors());



app.get('/', async(req, res) => {
    const db = client.db(dbName);

    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

app.post('/', async(req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
  res.send({success: true, result: findResult})
})
app.delete('/', async(req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
  res.send({success: true, result: findResult})
})
client.connect()
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start your server here
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });



// app.listen(port, () => {
//   console.log(`Example app listening on port http://localhost:${port}`)
// })
