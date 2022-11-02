import { SessionFlavor } from 'grammy'
import Context from '@/models/Context'

export enum adminState {
  insertDate = 'insertDate',
  insertTitle = 'insertTitle',
  insertDescription = 'insertDescription',
  insertPhoto = 'insertPhoto',
  insertMaxPlayers = 'insertMaxPlayers',
  insertPlace = 'insertPlace',
  insertPrice = 'insertPrice',
  default = 'default',
}

export enum userState {
  default = 'default',
  sendName = 'sendName',
  sendPhone = 'sendPhone',
  sendPhoto = 'sendPhoto',
}

export interface SessionData {
  userId: number
  currentTitle?: string
  currentBonuses?: number
  admin: { state: adminState; eventTitle?: string }
  state: userState
}

export type BotContext = Context & SessionFlavor<SessionData>
