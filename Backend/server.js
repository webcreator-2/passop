const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');

dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = process.env.DB_NAME;
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(cors());

// MongoDB connection
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); // Exit the application if MongoDB connection fails
    }
}

// Call the connection function when the app starts
connectDB();

app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (error) {
        console.error("Error fetching passwords", error);
        res.status(500).send({ error: 'Failed to fetch passwords' });
    }
});

app.post('/', async (req, res) => {
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.insertOne(password);
        res.send({ success: true, result: result });
    } catch (error) {
        console.error("Error inserting password", error);
        res.status(500).send({ error: 'Failed to insert password' });
    }
});

app.delete('/', async (req, res) => {
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.deleteOne(password);
        res.send({ success: true, result: result });
    } catch (error) {
        console.error("Error deleting password", error);
        res.status(500).send({ error: 'Failed to delete password' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log("\nShutting down server...");
    await client.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
