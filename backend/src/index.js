import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { initDb } from './db.js';
import authRouter from './routes/auth.routes.js';
import errorHandler from './middleware/errorHandler.js';
import './services/passport.js';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_session_secret', // Replace with a real secret in production
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

app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initDb().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  });
}

export default app;
