import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function getTitles() {
  const res = await EventModel.find({ isActual: true })

  res.sort(function (a, b) {
    return +new Date(a.date) - +new Date(b.date)
  })

  const titles = res.map((el) => {
    return el.title
  })

  console.log(titles)
  return titles
}
