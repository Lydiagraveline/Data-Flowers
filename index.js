// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import CORS middleware
const path = require('path');

const app = express(); //make an instance of express

const portNumber = process.env.PORT || 3000; // Use process.env.PORT if available, otherwise fallback to 3000
const mongoURI = process.env.MONGODB_URI; // Use process.env.MONGODB_URI

// Create a MongoDB client
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Enable CORS for specific origins
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.ORIGIN],
  })
);

app.use(express.static('public'));

// Define route handler for root URL to serve client.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

const fetchDataFromCollection = async (res, collectionName, callback) => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('PersonalData');
    const collection = db.collection(collectionName);
   
    let data;

    // Optional, call a function to filter or sort the data
    if (typeof callback === 'function') {
        // If a filter callback is provided, use it to filter the data
      data = await collection.find({}).toArray();
      data = callback(data); // data = data.filter(filterCallback);
    } else {
        // If no filter callback is provided, fetch all data
        data = await collection.find({}).toArray();
    }

    res.json(data);
  } catch (error) {
    console.error(`Error connecting to MongoDB for ${collectionName} data:`, error);
    res.status(500).send('Error fetching data');
  } finally {
    if (client !== null) {
      client.close();
    }
  }
};

// Endpoint for 'hinge_matches' collection
app.get('/hingeData', async (req, res) => {
  await fetchDataFromCollection(res, 'hinge_matches');
});

app.listen(portNumber, () => {
  console.log("Server is running on port "+portNumber);
});
