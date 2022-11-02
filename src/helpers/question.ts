type QuestionModel = {
  [key in Complexity]: string[]
}

enum Complexity {
  newbie = 'newbie',
  amateur = 'amateur',
  advanced = 'advanced',
  pervert = 'pervert',
}

export default {
  [Complexity.newbie]: ['один', 'два', 'три', 'четыре'],
  [Complexity.advanced]: ['один', 'два', 'три', 'четыре'],
  [Complexity.amateur]: ['один', 'два', 'три', 'четыре'],
  [Complexity.pervert]: ['один', 'два', 'три', 'четыре'],
} as QuestionModel
