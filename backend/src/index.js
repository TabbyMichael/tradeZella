import dotenv from 'dotenv';
// Load environment variables first
dotenv.config({ path: '.env' });

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { initDb } from './db.js';
import authRouter from './routes/auth.routes.js';
import tradeRouter from './routes/trade.routes.js';
import categoryRouter from './routes/category.routes.js';
import threadRouter from './routes/thread.routes.js';
import postRouter from './routes/post.routes.js';
import tagRouter from './routes/tag.routes.js';
import reactionRouter from './routes/reaction.routes.js';
import followRouter from './routes/follow.routes.js';
import playbookRouter from './routes/playbook.routes.js';
import backtestingRouter from './routes/backtesting.routes.js';
import reportRouter from './routes/report.routes.js';
import brokerRouter from './routes/broker.routes.js';
import errorHandler from './middleware/errorHandler.js';
import './services/passport.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret', // Replace with a real secret in production
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get('/', (req, res) => {
  res.send('TradeZella Backend is running!');
});

app.use('/api/auth', authRouter);
app.use('/api/trades', tradeRouter);
app.use('/api/community/categories', categoryRouter);
app.use('/api/community/threads', threadRouter);
app.use('/api/community/posts', postRouter);
app.use('/api/community/tags', tagRouter);
app.use('/api/community/reactions', reactionRouter);
app.use('/api/community/follow', followRouter);
app.use('/api/playbooks', playbookRouter);
app.use('/api/backtesting', backtestingRouter);
app.use('/api/reports', reportRouter);
app.use('/api/brokers', brokerRouter);

app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database tables
    await initDb();
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;