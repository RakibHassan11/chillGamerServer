# ChillGamer Server

ChillGamer Server is the backend server for ChillGamer, a game review application. This server provides RESTful APIs to handle user reviews and watchlists, allowing users to share and explore game reviews. It is built using Node.js, Express.js, and MongoDB.

---

## Features
- **Review Management**:
  - Add, update, delete, and fetch game reviews.
  - Fetch reviews by email or individual review ID.
  - Get the total count of reviews by a user.
- **Watchlist Management**:
  - Add games to a personalized watchlist.
  - Fetch watchlist items by user email.
  - Remove items from the watchlist.
- **Secure Database Connection** using MongoDB with environment variables.

---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using MongoDB Atlas)
- **Middleware**: CORS, Express JSON

---

## Environment Variables
The project requires the following environment variables in a `.env` file:

