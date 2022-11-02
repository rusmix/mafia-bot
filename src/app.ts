import 'reflect-metadata'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { adminState, SessionData, userState } from '@/middlewares/session'
import { UserModel } from '@/models/User'
import { run } from '@grammyjs/runner'
import { session } from 'grammy'
import Context from '@/models/Context'
import attachUser from '@/middlewares/attachUser'
import attachUserId from '@/middlewares/attachUserId'
import bot from '@/helpers/bot'
import checkSubscribers from './handlers/checkSubsribers'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import sequentialize, { getSessionKey } from '@/middlewares/sequentialize'
import start from './handlers/start'
import startMongo from '@/helpers/startMongo'
import getAdmin from '@/handlers/admin/getAdmin'
import { adminKeyboard, numbers } from './helpers/keyboards'
import addEvent from './handlers/admin/addEvent'
import showAfisha from './handlers/showAfisha'
import getTitles from './helpers/getTitles'
import eventButtonHandler from './handlers/eventButtonHandler'
import setCallback from './helpers/setCallbackAfisha'
import registration from './handlers/registration'
import registerToEvent from './handlers/registerToEvent'
import successfulPayment from './handlers/successfulPayment'
import sendBill from './handlers/sendBill'

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
    {
      command: 'start',
      description: 'Запустить бота',
    },
    { command: 'afisha', description: 'Посмотреть мероприятия' },
  ])
  console.log('The bot commands are set')

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

  // Commands
  bot.command('start', start)
  bot.command('afisha', showAfisha)
  bot.command('getadmin22', getAdmin)
  bot.command('admin', async (ctx: Context) => {
    if (ctx.dbuser.isAdmin)
      await ctx.reply('Выберите опцию ниже', { reply_markup: adminKeyboard })
  })

  bot.on('message', (ctx: Context) => {
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

  // Callbacks
  bot.callbackQuery('help', async (ctx: Context) => {
    await ctx.reply('help')
  })

  bot.callbackQuery('addEvent', addEvent)

  bot.callbackQuery('register', registerToEvent)
  // bot.callbackQuery('showPlayers', showPlayers)

  bot.callbackQuery(['left', 'right'], eventButtonHandler)

  bot.callbackQuery(numbers, sendBill)

  void setCallback()
  // setInterval(setCallback, 30000)
  bot.on('pre_checkout_query', async (ctx: Context) => {
    //  ОПЛАТА ЧЕРЕЗ ТЕЛЕГРАМ ЕСЛИ НУЖНА ВКЛЮЧИТЬ
    console.log('Происходит оплата...')
    await ctx.answerPreCheckoutQuery(true)
  }) // ответ на предварительный запрос по оплате

  bot.on(':successful_payment', async (ctx: Context) => {
    console.log()
    await successfulPayment(ctx)
  })

  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)

  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
