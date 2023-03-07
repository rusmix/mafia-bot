import Context from '@/models/Context';

export default function verifyPhoto(ctx: Context): string | undefined {
  if (ctx.message?.document) return;

  if (ctx.message?.photo) return ctx.message.photo.slice(-1)[0].file_id;
}
