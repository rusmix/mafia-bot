import * as findorcreate from 'mongoose-findorcreate';
import {
  DocumentType,
  getModelForClass,
  plugin,
  prop,
} from '@typegoose/typegoose';
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './User';

@plugin(findorcreate)
export class Event extends FindOrCreate {
  @prop({ index: true })
  title: string;

  @prop({})
  description: string;

  @prop({})
  place: string;

  @prop({})
  price: number;

  @prop({})
  photoId: string;

  @prop({})
  players: { user: User; guests?: number }[];

  @prop({ default: 0 })
  amountOfPlayers: number;

  @prop({})
  date: Date;

  @prop({})
  maxPlayers: number;

  @prop({ index: true, default: true })
  isActual: boolean;

  public static async getActualEvents(): Promise<DocumentType<Event>[]> {
    // const events = (await EventModel.find({ isActual: true })).filter(
    //   (potentialEvent) =>
    //     !Object.keys(testEvent).some((key) => potentialEvent[key] === undefined)
    // )
    const events = await EventModel.find({ isActual: true });
    return events;
  }
}

const testEvent = new Event();
testEvent.title = 'test';
testEvent.description = 'test';
testEvent.place = 'test';
testEvent.price = 1;
testEvent.photoId = 'test';
testEvent.players = [];
testEvent.amountOfPlayers = 0;
testEvent.date = new Date();
testEvent.maxPlayers = 0;
testEvent.isActual = false;
export default testEvent;

export const EventModel = getModelForClass(Event, {
  schemaOptions: { timestamps: true },
});
