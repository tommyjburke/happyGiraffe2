const mongoose = require('mongoose')
const Schema = mongoose.Schema

const divsDataSchema = new mongoose.Schema({
   spanValues: [String],
   inputValue: String,
})

const gameOptionsSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   numQuestions: {
      type: Number,
      required: true,
   },
   userHiddenOption: {
      type: String,
      required: true,
   },
   operators: [String],
   useCountdown: {
      type: Boolean,
      required: true,
   },
   countdownSeconds: {
      type: Number,
      required: true,
   },
   notes: String,
   aValue: [Number],
   bValue: [Number],
})

const mathsQuizSchema = new mongoose.Schema(
   {
      teacherId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'UserModel',
      },
      type: {
         type: String,
         default: 'MathsQuiz',
         required: true,
      },
      divsData: [divsDataSchema],
      gameOptions: gameOptionsSchema,
   },
   {
      timestamps: true,
   }
)

const MathsQuizModel = mongoose.model('mathsquizzes', mathsQuizSchema)

module.exports = MathsQuizModel
