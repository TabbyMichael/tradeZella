import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const port = 3001;
const JWT_SECRET = 'your_jwt_secret'; // TODO: Move to environment variable

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('TradeZella Backend is running!');
});

// Auth Routes
const authRouter = express.Router();

// Register
authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  await db.read();
  const existingUser = db.data.users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashedPassword };

  db.data.users.push(newUser);
  await db.write();

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ token });
});

// Login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  await db.read();
  const user = db.data.users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

app.use('/api/auth', authRouter);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
