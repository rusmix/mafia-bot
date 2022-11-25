import { DocumentType } from '@typegoose/typegoose';
import { Event, EventModel } from '@/models/Event';
import { InlineKeyboard, Keyboard } from 'grammy';
import Context from '@/models/Context';

export const phoneKeyboard = new Keyboard().requestContact(
  'Отправить номер телефона'
);

export const navigationKeyboard = new InlineKeyboard()
  .text('◀️', 'left')
  .text('▶️', 'right');

export const navigationKeyboardRight = new InlineKeyboard().text('▶️', 'right');

export const navigationKeyboardLeft = new InlineKeyboard().text('◀️', 'left');

export const adminKeyboard = new InlineKeyboard().text(
  'Добавить ивент',
  'addEvent'
);

export const numbers = ['1', '2', '3', '4', '5', '6'];

export const numbersKeyboard = (amount: number) => {
  let keyboard = new InlineKeyboard().text('Я один', '1');
  if (amount < 6) {
    for (let i = 2; i <= amount; i++) {
      keyboard = keyboard.text(`+ ${i - 1}`, `${i}`);
    }
    return keyboard;
  }
  return keyboard
    .text('+ 1', '2')
    .text('+ 2', '3')
    .row()
    .text('+ 3', '4')
    .text('+ 4', '5')
    .text('+ 5', '6');
};

export const eventsKeyboard = async () => {
  // let res = await EventModel.find({ isActual: true }) // title date (day of week) place

  const res = await EventModel.getActualEvents();

  // console.log(
  //   res,
  //   '\n_________________________________\n_________________________________\n'
  // )
  // console.log(res)
  let keyboard = new InlineKeyboard();

  res.sort(function (a, b) {
    return +new Date(a.date) - +new Date(b.date);
  });

  res.map((el) => {
    keyboard = keyboard
      .text(
        `${el.title} в ${el.date.toLocaleString('ru', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        })}, в ${el.place}`,
        `${el.title}`
      )
      .row();
  });
  return keyboard;
};

export const oneEventKeyboard = (event: DocumentType<Event>, ctx: Context) => {
  const amount = event.amountOfPlayers;
  const maxAmount = event.maxPlayers;

  let keyboard = new InlineKeyboard()
    .text('◀️', 'left')
    .text('▶️', 'right')
    .row()
    .text(`Игроки (${amount}/${maxAmount})`, 'showPlayers');

  const player = event.players.find((el) => {
    return el.user.id === ctx.dbuser.id;
  });

  if (amount < maxAmount && !player)
    keyboard = keyboard.row().text(`Записаться`, 'register');

  if (player) {
    keyboard = keyboard.row().text(`Отменить бронь`, 'unregister');

    if (event.maxPlayers - event.amountOfPlayers > 0)
      keyboard = keyboard.row().text('Добавить 1 друга', 'addFriend');
    if (player.guests > 0)
      keyboard = keyboard.row().text('Удалить 1 друга', 'deleteFriend');
  }

  return keyboard;
};

export const oneEventAdminKeyboard = new InlineKeyboard()
  .text('◀️', 'left')
  .text('▶️', 'right')
  .row()
  .text('Удалить событие', 'deleteEvent')
  .row()
  .text('Редактировать событие', 'editEvent')
  .row()
  .text('Игроки', 'showPlayers');

export const yesOrNoKeyboard = new InlineKeyboard()
  .text('ДА', 'yes')
  .text('НЕТ', 'no');

export const editProfileKeyboard = new InlineKeyboard()
  .text('Изменить фото', 'changePhotoProfile')
  .row()
  .text('Изменить имя', 'changeNameProfile')
  .row()
  .text('Изменить номер телефона', 'changePhoneProfile');

export const editEventKeyboard = new InlineKeyboard()
  .text('Поменять заголовок', 'changeTitle')
  .row()
  .text('Поменять место', 'changePlace')
  .row()
  .text('Поменять дату', 'changeDate')
  .row()
  .text('Поменять описание', 'changeDescription')
  .row()
  .text('Поменять фотографию', 'changePhoto')
  .row()
  .text('Поменять лимит игроков', 'changePlayerLimit');

export const payKeyboard = (url: string) => {
  const keyboard = new InlineKeyboard().url('Оплата QIWI', url);
  return keyboard;
};

export const webAppKeyboard = {
  inline_keyboard: [
    [
      {
        text: 'Оферта',
        web_app: { url: '' },
        resize: true,
      },
    ],
  ],
};
