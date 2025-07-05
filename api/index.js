// This sets up the server.

import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import users from './mongoose/users.js';

mongoose.connect(process.env.DATABASE_ADDRESS);

const app = express();
app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.EXPRESS_SESSION_SECURE === 'false' ? false : true,
    sameSite: process.env.EXPRESS_SESSION_SAME_SITE,
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
    ttl: 30 * 24 * 60 * 60,
  }),
}));

app.get('/api/', (req, res) => {
  res.status(200).send('Expenses Server');
});

app.use(async (req, res, next) => {
  try {
    if (req.session.userId) {
      const user = await users.readById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    }
    req.user = null;
    next();
  } catch (error) {
    next(error);
  }
});

import signInRouter from './routes/signIn.js';
app.use('/api/signin', signInRouter);
import signUpRouter from './routes/signUp.js';
app.use('/api/signup', signUpRouter);
import sessionRouter from './routes/session.js';
app.use('/api/session', sessionRouter);

app.use((req, res) => {
  const message = `There is no route ${req.url} that supports a ${req.method} request.`;
  res.status(404).send(message);
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Sorry, an error occurred.' });
});

app.listen(3000);

export default app;
