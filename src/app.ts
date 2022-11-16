import 'reflect-metadata'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { oneEventHandler as OneAdminEventHandler } from './handlers/admin/OneEventHandler'
import { UserModel } from '@/models/User'
import { adminKeyboard, numbers, oneEventKeyboard } from './helpers/keyboards'
import { SessionData, adminState, userState } from '@/middlewares/session'
import { run } from '@grammyjs/runner'
import { session } from 'grammy'
import Context from '@/models/Context'
import addEvent from './handlers/admin/addEvent'
import attachUser from '@/middlewares/attachUser'
import attachUserId from '@/middlewares/attachUserId'
import bot from '@/helpers/bot'
import checkSubscribers from './handlers/checkSubsribers'
import eventButtonHandler from './handlers/OneEventHandler'
import getAdmin from '@/handlers/admin/getAdmin'
import getTitles from './helpers/getTitles'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import registerToEvent from './handlers/registerToEvent'
import registration from './handlers/registration'
import sendBill from './handlers/sendBill'
import sequentialize, { getSessionKey } from '@/middlewares/sequentialize'
import setCallback from './helpers/setCallbackAfisha'
import showAfisha from './handlers/showAfisha'
import showPlayers from './handlers/showPlayers'
import showProfile from './handlers/showProfile'
import start from './handlers/start'
import startMongo from '@/helpers/startMongo'
import successfulPayment from './handlers/successfulPayment'
import editEvent, {
  editEventHandler,
  editEventMessageHandler,
} from './handlers/admin/editEvent'
import deleteEvent from './handlers/admin/deleteEvent'
import { EventModel } from './models/Event'
import cancelEventRegistration from './handlers/cancelEventRegistration'
import changeProfile from './handlers/changeProfile'
import { writeOffBonuses } from './handlers/admin/writeOffBonuses'
async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  // for deleting answers during tests
  // await AnswerModel.deleteMany()
  // await UserModel.deleteMany()
  // await PaymentModel.deleteMany()

  // Setup bot command
  await bot.api.setMyCommands([
    { command: 'afisha', description: 'Посмотреть мероприятия' },
    { command: 'start', description: 'Продолжить регистрацию' },
    { command: 'profile', description: 'Посмотреть свой профиль' },
  ])
  console.log('The bot commands are set')
  // await UserModel.updateMany({}, { $set: { isSentNewEvent: false } })
  // await UserModel.updateMany({}, { $set: { isActive: true } })
  // Middlewares
  bot.use(sequentialize)
  bot.use(
    session({
      initial(): SessionData {
        return {
          userId: 0,
          admin: { state: 'default' as adminState },
          state: 'default' as userState,
        }
      },
      getSessionKey,
    })
  )
  bot.use(ignoreOldMessageUpdates)
  bot.use(attachUser)
  bot.use(attachUserId)

  bot.on(':successful_payment', async (ctx: Context) => {
    console.log('kook??____')
    await successfulPayment(ctx)
  })
  // Commands
  bot.command('start', start)
  bot.command('writeoffbonuses', writeOffBonuses)
  bot.command('afisha', showAfisha)
  bot.command('profile', showProfile)
  bot.command('getadmin22', getAdmin)
  bot.command('admin', async (ctx: Context) => {
    if (ctx.dbuser.isAdmin)
      await ctx.reply('Выберите опцию ниже', { reply_markup: adminKeyboard })
  })

  bot.on('message', (ctx: Context) => {
    if (ctx.dbuser.isAdmin && ctx.session.adminEditing === true)
      return editEventMessageHandler(ctx)
    if (ctx.dbuser.isAdmin && ctx.session.admin.state !== 'default') {
      return addEvent(ctx)
    }
    if (
      !ctx.dbuser.isAdmin &&
      (ctx.session.state === 'sendName' ||
        ctx.session.state === 'sendPhone' ||
        ctx.session.state === 'sendPhoto')
    ) {
      return registration(ctx)
    }
  })

  bot.on('my_chat_member', async (ctx: Context) => {
    //function on block bot
    if (ctx.update.my_chat_member?.new_chat_member)
      if (ctx.update.my_chat_member.new_chat_member.status === 'kicked') {
        console.log('nigger deactivated')
        ctx.dbuser.isActive = false
        await ctx.dbuser.save()
      }
  })

  // Callbacks
  bot.callbackQuery('help', async (ctx: Context) => {
    await ctx.reply('help')
  })

  bot.callbackQuery('addEvent', addEvent)

  bot.callbackQuery('register', registerToEvent)
  bot.callbackQuery('showPlayers', showPlayers)

  bot.callbackQuery('unregister', cancelEventRegistration)
  bot.callbackQuery(['addFriend', 'deleteFriend'], async (ctx: Context) => {
    const event = await EventModel.findOne({ title: ctx.session.currentTitle })
    const player = event.players.find((el) => {
      return el.user.id === ctx.dbuser.id
    })
    const index = event.players.findIndex((el) => {
      return el.user.id === ctx.dbuser.id
    })
    let resulted = ''
    if (ctx.match === 'addFriend') {
      player.guests += 1
      event.amountOfPlayers += 1
      resulted = 'добавлен'
    }
    if (ctx.match === 'deleteFriend') {
      player.guests -= 1
      event.amountOfPlayers -= 1
      resulted = 'удалён'
    }
    event.players[index] = player
    await event.save()

    await ctx.editMessageMedia(
      {
        type: 'photo',
        media: `${event.photoId}`,
        caption: ` ${event.title} \n\n${event.date.toLocaleString('ru', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        })}, в ${event.place}\n\n${event.description}`,
      },
      { reply_markup: oneEventKeyboard(event, ctx) }
    )
  })

  bot.callbackQuery(['deleteEvent', 'yes', 'no'], deleteEvent)

  bot.callbackQuery('editEvent', async (ctx: Context) => {
    if (ctx.dbuser.isAdmin) return await editEvent(ctx)
  })

  bot.callbackQuery(
    ['changePhotoProfile', 'changeNameProfile', 'changePhoneProfile'],
    changeProfile
  )

  bot.callbackQuery(
    [
      'changePlace',
      'changeDate',
      'changeDescription',
      'changePhoto',
      'changeTitle',
    ],
    editEventHandler
  )

  bot.callbackQuery(['left', 'right'], async (ctx: Context) => {
    if (ctx.dbuser.isAdmin) {
      return await OneAdminEventHandler(ctx)
    }
    await eventButtonHandler(ctx)
  })

  bot.callbackQuery(numbers, sendBill)

  void setCallback()

  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)

  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
