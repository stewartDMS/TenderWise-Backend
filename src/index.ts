import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './utils/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error';
import path from 'path';
import fs from 'fs';

const app: Application = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.resolve(config.upload.uploadDir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TenderWise Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`✓ TenderWise Backend Server running on port ${PORT}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API base: http://localhost:${PORT}/api`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
