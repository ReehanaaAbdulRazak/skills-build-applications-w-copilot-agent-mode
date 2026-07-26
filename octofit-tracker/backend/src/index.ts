import express from 'express';
import './config/database';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-tracker-backend' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
