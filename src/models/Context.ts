import { Context as BaseContext } from 'grammy';
import { I18nContext } from '@grammyjs/i18n/dist/source';
import { SessionData } from '@/middlewares/session';
import { IUser as User } from '@/models/User';

interface Context extends BaseContext {
  dbuser: User;
  session: SessionData;
}

export default Context;
