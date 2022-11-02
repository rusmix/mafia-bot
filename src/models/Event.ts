import * as findorcreate from 'mongoose-findorcreate'
import {
  DocumentType,
  getModelForClass,
  plugin,
  prop,
} from '@typegoose/typegoose'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import { User } from './User'

@plugin(findorcreate)
export class Event extends FindOrCreate {
  @prop({ index: true })
  title: string

  @prop({})
  description: string

  @prop({})
  place: string

  @prop({})
  price: number

  @prop({})
  photoId: string

  @prop({})
  players: User[]

  @prop({})
  date: Date

  @prop({})
  maxPlayers: number

  @prop({ index: true, default: true })
  isActual: boolean
  //   public static async doSomething(this: DocumentType<User>, id: number) {
  //     this.id = id
  //     await this.save()
  //   }
}

export const EventModel = getModelForClass(Event, {
  schemaOptions: { timestamps: true },
})
