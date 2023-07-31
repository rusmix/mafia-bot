import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

interface Stats {
  gamesTotal: number;
  pointsTotal: number;
}

export enum State {
  title = 'title',
  description = 'description',
  photoId = 'photoId',
}

export interface IUser extends Document {
  id: number;
  usernameTg: string;
  name: string;
  gamename: string;
  language: string;
  thisMonthStats: Stats;
  thisYearStats: Stats;
  club: string;
  balance: number;
  currentBonuses?: number;
  phone: string;
  photoId: string;
  isSentNewEvent: boolean;
  isAdmin: boolean;
  isActive: boolean;
  isBanned: boolean;
  isRegistered: boolean;
}

const statsSchema = new Schema({
  gamesTotal: { type: Number, default: 0 },
  pointsTotal: { type: Number, default: 0 },
});

const userSchema = new Schema<IUser>({
  id: { type: Number, required: true, index: true, unique: true },
  usernameTg: { type: String, index: true },
  name: { type: String, default: 'кто-то' },
  gamename: String,
  language: { type: String, required: true, default: 'ru' },
  thisMonthStats: { type: statsSchema, default: () => ({}) },
  thisYearStats: { type: statsSchema, default: () => ({}) },
  club: String,
  balance: { type: Number, default: 0 },
  currentBonuses: Number,
  phone: { type: String, default: 'какой-то', index: true },
  photoId: String,
  isSentNewEvent: { type: Boolean, index: true, default: false },
  isAdmin: { type: Boolean, index: true, required: true, default: false },
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  isRegistered: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('users', userSchema, 'users');
