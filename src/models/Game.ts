import mongoose, { Document, Schema, Types, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

export enum Roles {
  yaponchik = 'Япончик',
  mafia = 'Мафия',
  sniper = 'Снайпер',
  doctor = 'Доктор',
  felix = 'Железный феликс',
  shtirlitz = 'Штирлиц',
  angela = 'Анжела',
  saper = 'Сапер',
  immortal = 'Бессмертный',
  oboroten = 'Оборотень',
  holyman = 'Священник',
  zatikator = 'Затыкатор',
  citizen = 'Мирный житель',
  default = 'default',
}

enum Phase {
  day = 'day',
  night = 'night',
}

export enum Status {
  alive = 'alive',
  dead = 'dead',
  inPrison = 'inPrison',
  default = 'default',
}

export interface IPlayer {
  id: ObjectId; //Schema.Types.ObjectId;
  name: string;
  role: Roles;
  points: number;
  status: Status;
  votedTo: Types.ObjectId;
}

export interface IGame extends Document {
  isActual: boolean;
  players: IPlayer[];
  mafiaPeople: number;
  citizen: number;
  phase: Phase;
  nightCount: number;
  saper: Types.ObjectId[];
  saperKills: number;
  immortalCount: number;
  oborotenCount: number;
}

const gameSchema = new Schema<IGame>(
  {
    isActual: { type: Boolean, index: true, default: true },
    players: [
      {
        id: { type: Schema.Types.ObjectId },
        name: String,
        role: { type: String, enum: Roles },
        points: Number,
        status: { type: String, enum: Status },
        votedTo: { type: Schema.Types.ObjectId },
      },
    ],
    mafiaPeople: Number,
    citizen: Number,
    phase: { type: String, enum: Phase },
    nightCount: { type: Number, default: 0 },
    saper: [{ type: Schema.Types.ObjectId }],
    saperKills: Number,
    immortalCount: { type: Number, default: 4 },
    oborotenCount: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const GameModel = mongoose.model<IGame>('games', gameSchema, 'games');
