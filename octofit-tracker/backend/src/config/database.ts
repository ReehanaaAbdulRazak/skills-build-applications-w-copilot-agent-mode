import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

const connectToDatabase = async () => {
  try {
    if (db.readyState === 1) {
      return;
    }

    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
  } catch (error) {
    console.warn('MongoDB connection unavailable, continuing without database:', error);
  }
};

const waitForDatabaseConnection = async () => {
  if (db.readyState === 1) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      db.off('open', onOpen);
      db.off('error', onError);
    };

    db.once('open', onOpen);
    db.once('error', onError);
  });
};

connectToDatabase();
db.on('error', console.error.bind(console, 'connection error:'));

export { connectToDatabase, waitForDatabaseConnection };
export default db;
