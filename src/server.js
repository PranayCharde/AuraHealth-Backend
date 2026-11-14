// AuraHealth Server Entrypoint - Live MongoDB Connected
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables explicitly from backend root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { connectDB, isDbConnected } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const activityRoutes = require('./routes/activityRoutes');
const hydrationRoutes = require('./routes/hydrationRoutes');
const mindfulnessRoutes = require('./routes/mindfulnessRoutes');
const syncRoutes = require('./routes/syncRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// 1. Security & Body Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Request Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 3. Root & Health Check Endpoints
app.use(express.static(path.join(__dirname, '../public')));

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/privacy-policy.html'));
});

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'AuraHealth Premium Telemetry REST API',
    version: '1.0.0',
    status: 'ONLINE',
    database: isDbConnected() ? 'CONNECTED' : 'DISCONNECTED (Pending Setup)',
    docs: {
      auth: '/api/auth',
      nutrition: '/api/nutrition',
      vitals: '/api/vitals',
      sleep: '/api/sleep',
      activity: '/api/activity',
      hydration: '/api/hydration',
      mindfulness: '/api/mindfulness',
      sync: '/api/sync',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    uptime: process.uptime(),
    status: 'HEALTHY',
    database: isDbConnected() ? 'CONNECTED' : 'DISCONNECTED (Pending Setup)',
    dbHost: mongoose.connection?.host || 'none',
    dbName: mongoose.connection?.name || 'none',
    timestamp: new Date().toISOString(),
  });
});

// 4. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/hydration', hydrationRoutes);
app.use('/api/mindfulness', mindfulnessRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);

// 5. 404 Route Catch-All
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// 6. Central Error Handling Middleware
app.use(errorHandler);

// 7. Start Express Server
const PORT = process.env.PORT || 5000;

let server;
if (require.main === module || process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log('======================================================================');
    console.log(`[AuraHealth Backend] Server active and listening on port ${PORT}`);
    console.log(`[Environment] Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[Database Status] MongoDB is ${isDbConnected() ? 'Connected' : 'Pending (Will connect when DB is started)'}`);
    console.log(`[Health Check] http://localhost:${PORT}/api/health`);
    console.log('======================================================================');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
  });

  // Graceful termination handling for Nodemon & system signals
  const gracefulShutdown = () => {
    if (server) {
      server.close(() => {
        console.log('[AuraHealth Backend] Server cleanly shut down and port released.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.once('SIGUSR2', () => {
    if (server) {
      server.close(() => {
        process.kill(process.pid, 'SIGUSR2');
      });
    }
  });
}

module.exports = app;

