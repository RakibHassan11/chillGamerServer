require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ddue6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db('addReview');
const reviewCollection = database.collection('reviews');
const watchlistCollection = database.collection('watchlist');

// Connect to MongoDB
async function run() {
    try {
       // await client.connect();
       // await client.db("admin").command({ ping: 1 });
       // console.log("Successfully connected to MongoDB!");

        // Review routes
        app.get('/reviews', async (req, res) => {
            try {;
                const { email } = req.query;
                const query = email ? { email } : {};
                const reviews = await reviewCollection.find(query).toArray();
                res.send(reviews);
            } catch (error) {
                res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
            }
        });

        app.get('/reviews/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const review = await reviewCollection.findOne({ _id: new ObjectId(id) });
                if (!review) return res.status(404).json({ message: 'Review not found' });
                res.send(review);
            } catch (error) {
                res.status(500).json({ message: 'Failed to fetch review', error: error.message });
            }
        });

        app.post('/reviews', async (req, res) => {
            try {
                const newReview = req.body;
                console.log(req.body)
                if (!newReview.userEmail || !newReview.gameTitle || !newReview.reviewDescription || !newReview.rating || !newReview.publishingYear || !newReview.genre) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                newReview.timestamp = new Date();
                const result = await reviewCollection.insertOne(newReview);
                console.log(result)
                res.status(201).json(result);
            } catch (error) {
                console.log(error.message)
                res.status(500).json({ message: 'Failed to add review', error: error.message });
            }
        });

        app.put('/reviews/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const updatedData = req.body;
                const result = await reviewCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
                res.json(result);
            } catch (error) {
                res.status(500).json({ message: 'Failed to update review', error: error.message });
            }
        });

        app.delete('/reviews/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                res.status(500).json({ message: 'Failed to delete review', error: error.message });
            }
        });

        // Watchlist routes
        app.get('/watchlist', async (req, res) => {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).json({ message: 'Email is required' });
                const watchlist = await watchlistCollection.find({ email }).toArray();
                res.send(watchlist);
            } catch (error) {
                res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message });
            }
        });

        app.post('/watchlist', async (req, res) => {
            try {
                const newWatchlistItem = req.body;
                if (!newWatchlistItem.email || !newWatchlistItem.gameId) {
                    return res.status(400).json({ message: 'Email and GameId are required' });
                }
                const result = await watchlistCollection.insertOne(newWatchlistItem);
                res.status(201).json(result);
            } catch (error) {
                res.status(500).json({ message: 'Failed to add to watchlist', error: error.message });
            }
        });

        app.delete('/watchlist/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const result = await watchlistCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (error) {
                res.status(500).json({ message: 'Failed to delete from watchlist', error: error.message });
            }
        });

        // Review count route
        app.get('/reviews/count', async (req, res) => {
            try {
                const { email } = req.query;
                if (!email) return res.status(400).json({ message: 'Email is required' });
                const reviewCount = await reviewCollection.countDocuments({ email });
                res.send({ count: reviewCount });
            } catch (error) {
                res.status(500).json({ message: 'Failed to fetch review count', error: error.message });
            }
        });

    } finally {
        // cleanup if necessary
    }
}

// Initialize the MongoDB connection
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
