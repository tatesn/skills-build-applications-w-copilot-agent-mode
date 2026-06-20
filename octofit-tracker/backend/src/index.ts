import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = Number(process.env.PORT || 8000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    mongoReadyState: mongoState,
  });
});

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  } catch (error) {
    console.error('MongoDB connection failed. The API will still start:', error);
  }

  app.listen(PORT, () => {
    const codespaceName = process.env.CODESPACE_NAME;
    const baseUrl = codespaceName
      ? `https://${codespaceName}-8000.app.github.dev`
      : `http://localhost:${PORT}`;

    console.log(`OctoFit backend listening on ${baseUrl}`);
  });
};

void startServer();
