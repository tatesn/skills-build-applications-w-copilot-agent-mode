import express from 'express';
import mongoose from 'mongoose';

import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';

const app = express();
const PORT = 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;

const getApiBaseUrl = (): string => {
  const host = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${PORT}`;

  return `${host}/api`;
};

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    mongoReadyState: mongoState,
    apiBaseUrl: getApiBaseUrl(),
  });
});

app.get('/api/users/', async (_req, res) => {
  const items = await User.find().sort({ createdAt: -1 }).lean();
  res.json({ resource: 'users', count: items.length, items });
});

app.get('/api/teams/', async (_req, res) => {
  const items = await Team.find().populate('memberIds', 'name email fitnessLevel').lean();
  res.json({ resource: 'teams', count: items.length, items });
});

app.get('/api/activities/', async (_req, res) => {
  const items = await Activity.find().populate('userId', 'name').sort({ completedAt: -1 }).lean();
  res.json({ resource: 'activities', count: items.length, items });
});

app.get('/api/leaderboard/', async (_req, res) => {
  const items = await Leaderboard.find().populate('userId', 'name').sort({ rank: 1 }).lean();
  res.json({ resource: 'leaderboard', count: items.length, items });
});

app.get('/api/workouts/', async (_req, res) => {
  const items = await Workout.find().sort({ difficulty: 1, durationMinutes: 1 }).lean();
  res.json({ resource: 'workouts', count: items.length, items });
});

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  } catch (error) {
    console.error('MongoDB connection failed. The API will still start:', error);
  }

  app.listen(PORT, () => {
    console.log(`OctoFit backend listening on ${getApiBaseUrl()}`);
  });
};

void startServer();
