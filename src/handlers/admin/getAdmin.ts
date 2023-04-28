import Context from '@/models/Context';

export default async function getAdmin(ctx: Context) {
  if (ctx.dbuser.isAdmin) {
    ctx.dbuser.isAdmin = false;
    await ctx.reply('больше не админ');
  } else {
    ctx.dbuser.isAdmin = true;
    await ctx.reply('сейчас админ');
  }
  await ctx.dbuser.save();
}
