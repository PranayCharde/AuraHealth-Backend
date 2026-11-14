const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurahealth';

  try {
    // Set mongoose connection options
    mongoose.set('strictQuery', false);

    console.log(`[MongoDB] Attempting connection to: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);

    // Check if initial seeding is needed
    try {
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('[MongoDB] Empty database detected. Seeding initial athletes...');
        const { seedDatabase } = require('../scripts/seedDatabase');
        await seedDatabase();
      }
    } catch (e) {
      // ignore
    }
  } catch (error) {
    isConnected = false;
    console.warn('----------------------------------------------------------------------');
    console.warn('[MongoDB] NOTICE: Database is not currently reachable.');
    console.warn(`[MongoDB] Reason: ${error.message}`);
    console.warn('[MongoDB] The Express server will continue running normally.');
    console.warn('[MongoDB] When you start MongoDB or provide a valid URI in .env,');
    console.warn('[MongoDB] the backend will automatically connect.');
    console.warn('----------------------------------------------------------------------');
  }

  // Handle connection events
  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('[MongoDB] Connection established with database.');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.warn(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] Disconnected from database.');
  });
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };

