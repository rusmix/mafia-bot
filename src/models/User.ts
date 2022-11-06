import * as findorcreate from 'mongoose-findorcreate'
import {
  DocumentType,
  getModelForClass,
  plugin,
  prop,
} from '@typegoose/typegoose'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'

interface Stats {
  gamesTotal: number
  pointsTotal: number
}

export enum State {
  title = 'title',
  description = 'description',
  photoId = 'photoId',
}

@plugin(findorcreate)
export class User extends FindOrCreate {
  @prop({ required: true, index: true, unique: true })
  id: number

  @prop({ index: true })
  usernameTg: string

  @prop({})
  name: string

  @prop({})
  gamename: string

  @prop({ required: true, default: 'ru' })
  language: string

  @prop({ default: { gamesTotal: 0, pointsTotal: 0 } })
  thisMonthStats: Stats

  @prop({ default: { gamesTotal: 0, pointsTotal: 0 } })
  thisYearStats: Stats

  @prop({})
  club: string

  @prop({ default: 0 })
  balance: number

  @prop({})
  phone: string

  @prop({})
  photoId: string

  @prop({ index: true, required: true, default: false })
  isAdmin: boolean
  //   public static async doSomething(this: DocumentType<User>, id: number) {
  //     this.id = id
  //     await this.save()
  //   }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})
