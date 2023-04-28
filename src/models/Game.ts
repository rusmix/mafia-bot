import * as findorcreate from 'mongoose-findorcreate';
import {
  DocumentType,
  getModelForClass,
  plugin,
  prop,
} from '@typegoose/typegoose';
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectId } from 'mongoose';
import { User } from './User';

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
}

enum Phase {
  day = 'day',
  night = 'night',
}

export enum Status {
  alive = 'alive',
  dead = 'dead',
  inPrison = 'inPrison',
}

export interface IPlayer {
  id: ObjectId | string;
  name: string;
  role: Roles;
  points: number;
  status: Status;
}

@plugin(findorcreate)
export class Game extends FindOrCreate {
  @prop({ index: true, default: true })
  isActual: boolean;

  @prop()
  players: IPlayer[];
  @prop()
  mafiaPeople: number;
  @prop()
  citizen: number;
  @prop()
  phase: Phase;
  @prop({ default: 0 })
  nightCount: number;
  @prop()
  mafiaVoted: ObjectId;
  @prop()
  sniperVoted: ObjectId;
  @prop()
  doctorVoted: ObjectId;
  @prop()
  angelaVoted: ObjectId;
  @prop()
  felixVoted: ObjectId;
  @prop()
  shtirlitzVoted: ObjectId;
  @prop()
  saper: ObjectId[];
  @prop()
  saperKills: number;
  @prop({ default: 4 })
  immortalCount: number;
  @prop()
  zatikatorVoted: ObjectId;
  @prop({ default: 5 }) //превращается с 5 выстрела
  oborotenCount: number;

  //   public static as;ync getActualEvents(): Promise<DocumentType<Game>[]> {
  // const events = (await EventModel.find({ isActual: true })).filter(
  //   (potentialEvent) =>
  //     !Object.keys(testEvent).some((key) => potentialEvent[key] === undefined)
  // )
  //   }
}

export const GameModel = getModelForClass(Game, {
  schemaOptions: { timestamps: true },
});
