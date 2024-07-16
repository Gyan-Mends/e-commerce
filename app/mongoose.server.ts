

import mongoose from "mongoose";

// Define the database URL
const databaseUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/pos';

// Connect to the database
mongoose.connect(databaseUrl);

// Get the default connection
const db = mongoose.connection;

// Event handlers for successful and failed connection
db.on("connected", () => {
  console.log(`Connected to MongoDB`);
});

db.on("error", (error) => {
  console.error(`Error connecting to MongoDB: ${error}`);
});

// Export the connected mongoose instance
export default mongoose;
