import mongoose, { Document, Schema, Model, Aggregate } from 'mongoose';
import { IUser as User } from './User';
import { ObjectId } from 'mongodb';

export interface IEvent extends Document {
  title: string;
  description: string;
  place: string;
  price: number;
  photoId: string;
  players: { user: User; guests?: number }[];
  amountOfPlayers: number;
  date: Date;
  maxPlayers: number;
  isActual: boolean;
}

// Define an interface for static methods
interface IEventModel extends Model<IEvent> {
  aggregatePlayers(_id: ObjectId): Promise<IEvent>;
  getActualEvents(): Promise<IEvent[]>;
}

const eventSchema = new Schema<IEvent, IEventModel>(
  {
    title: { type: String, index: true },
    description: String,
    place: String,
    price: Number,
    photoId: String,
    players: [
      {
        user: { type: ObjectId, ref: 'User' },
        guests: Number,
      },
      {
        _id: false,
      },
    ],
    amountOfPlayers: { type: Number, default: 0 },
    date: Date,
    maxPlayers: Number,
    isActual: { type: Boolean, index: true, default: true },
  },
  { timestamps: true }
);

eventSchema.statics.getActualEvents = async function (): Promise<IEvent[]> {
  const events = await this.find({ isActual: true });
  return events;
};

eventSchema.statics.aggregatePlayers = async function (
  id: ObjectId
): Promise<any> {
  return this.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: 'users',
        localField: 'players.user',
        foreignField: '_id',
        as: 'userDocs'
      }
    },
    { $unwind: '$userDocs' },
    { $unwind: '$players' },
    {
      $addFields: {
        'players.user': {
          $cond: {
            if: { $eq: ['$players.user', '$userDocs._id'] },
            then: '$userDocs',
            else: '$players.user'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        players: { $push: '$players' },
        // Include other fields that you want to keep
      }
    }
  ]).exec();
};

export const EventModel = mongoose.model<IEvent, IEventModel>(
  'events',
  eventSchema,
  'events'
);
