const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(`${process.env.MONGO_URI}/Expensetracker`,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Get connection status
const db = mongoose.connection;

// Error handling
db.on('error', () => console.log('MongoDB connection error!'));

// Connection established
db.once('open', async () => {
  console.log('MongoDB connected successfully');
});

// Export the database connection
module.exports = db;