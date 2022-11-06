const formatDate = (str: string): Date | undefined => {
  const [year, month, date, hours, minutes] = str
    .split('-')
    .map((el) => Number(el))
  console.log(
    'year: ',
    year,
    'month: ',
    month,
    'date: ',
    date,
    'minutes: ',
    minutes
  )
  const formattedDate = new Date(year, month - 1, date, hours, minutes, 0, 0)
  console.log(formattedDate)
  if (!formattedDate) return
  return formattedDate
}

export default formatDate
