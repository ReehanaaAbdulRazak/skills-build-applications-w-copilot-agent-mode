import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin', teamId: 'team-1' },
      { id: 'user-2', name: 'Grace Hopper', email: 'grace@example.com', role: 'member', teamId: 'team-1' },
      { id: 'user-3', name: 'Margaret Hamilton', email: 'margaret@example.com', role: 'member', teamId: 'team-2' },
      { id: 'user-4', name: 'Katherine Johnson', email: 'katherine@example.com', role: 'member', teamId: 'team-2' },
    ]);

    const teams = await Team.insertMany([
      { id: 'team-1', name: 'Alpha', description: 'Early risers focused on endurance and consistency.', members: users.slice(0, 2).map((user) => user.id) },
      { id: 'team-2', name: 'Beta', description: 'Weekend warriors balancing strength and mobility.', members: users.slice(2).map((user) => user.id) },
    ]);

    await Activity.insertMany([
      { id: 'activity-1', type: 'run', duration: 30, userId: users[0].id, date: '2026-07-20', notes: 'Morning park run' },
      { id: 'activity-2', type: 'cycle', duration: 45, userId: users[1].id, date: '2026-07-21', notes: 'Hill intervals' },
      { id: 'activity-3', type: 'strength', duration: 40, userId: users[2].id, date: '2026-07-22', notes: 'Upper body circuit' },
      { id: 'activity-4', type: 'yoga', duration: 25, userId: users[3].id, date: '2026-07-23', notes: 'Stretch and recovery' },
    ]);

    await LeaderboardEntry.insertMany([
      { id: 'leaderboard-1', userId: users[0].id, points: 1280, rank: 1 },
      { id: 'leaderboard-2', userId: users[1].id, points: 1120, rank: 2 },
      { id: 'leaderboard-3', userId: users[2].id, points: 1035, rank: 3 },
      { id: 'leaderboard-4', userId: users[3].id, points: 980, rank: 4 },
    ]);

    await Workout.insertMany([
      { id: 'workout-1', name: 'HIIT Cardio', duration: 20, difficulty: 'advanced', focus: 'cardio', equipment: ['mat', 'timer'] },
      { id: 'workout-2', name: 'Mobility Flow', duration: 15, difficulty: 'beginner', focus: 'mobility', equipment: ['mat'] },
      { id: 'workout-3', name: 'Strength Builder', duration: 35, difficulty: 'intermediate', focus: 'strength', equipment: ['dumbbells', 'bench'] },
    ]);

    console.log('Database seeding complete');
    console.log(`Seeded ${users.length} users, ${teams.length} teams, 4 activities, 4 leaderboard entries, and 3 workouts.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
