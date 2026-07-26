import mongoose, { Schema, model, type Document } from 'mongoose';

type UserDocument = Document & {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string | null;
};

type TeamDocument = Document & {
  id: string;
  name: string;
  description: string;
  members: string[];
};

type ActivityDocument = Document & {
  id: string;
  type: string;
  duration: number;
  userId: string;
  date: string;
  notes?: string;
};

type LeaderboardEntryDocument = Document & {
  id: string;
  userId: string;
  points: number;
  rank: number;
};

type WorkoutDocument = Document & {
  id: string;
  name: string;
  duration: number;
  difficulty: string;
  focus: string;
  equipment: string[];
};

const userSchema = new Schema<UserDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  teamId: { type: String, default: null },
}, { timestamps: true });

const teamSchema = new Schema<TeamDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  members: { type: [String], default: [] },
}, { timestamps: true });

const activitySchema = new Schema<ActivityDocument>({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

const leaderboardEntrySchema = new Schema<LeaderboardEntryDocument>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  points: { type: Number, required: true },
  rank: { type: Number, required: true },
}, { timestamps: true });

const workoutSchema = new Schema<WorkoutDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  duration: { type: Number, required: true },
  difficulty: { type: String, required: true },
  focus: { type: String, required: true },
  equipment: { type: [String], default: [] },
}, { timestamps: true });

export const User = model<UserDocument>('User', userSchema);
export const Team = model<TeamDocument>('Team', teamSchema);
export const Activity = model<ActivityDocument>('Activity', activitySchema);
export const LeaderboardEntry = model<LeaderboardEntryDocument>('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = model<WorkoutDocument>('Workout', workoutSchema);

export default mongoose;
