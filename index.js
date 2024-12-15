const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ddue6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const reviewCollection = client.db('addReview').collection('reviews');


    app.get('/reviews', async(req, res) => {
        const cursor = reviewCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Route to add a review
    app.post('/addreview', async (req, res) => {
      const newReview = req.body; // Extract the review data from the request body
      console.log('New Review:', newReview);

      const result = await reviewCollection.insertOne(newReview); // Insert into MongoDB
      res.send(result);
    });

    // Ping to confirm MongoDB connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is Running' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server Running on Port: ${port}`);
});
