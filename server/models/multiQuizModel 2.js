const mongoose = require('mongoose')

const multiSchema = new mongoose.Schema(
   {
      type: {
         type: String,
         default: 'MultiQuiz',
         required: true,
      },

      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserModel',
         required: true,
      },

      title: {
         type: String,
         required: true,
      },
      useCountdown: {
         type: Boolean,
         required: true,
      },
      countdownSeconds: {
         type: Number,
      },
      notes: String,

      questions: {
         type: [mongoose.Schema.Types.ObjectId],
         ref: 'questions',
         required: true,
      },
   },

   {
      timestamps: true,
   }
)

const MultiQuizModel = mongoose.model('multis', multiSchema)
module.exports = MultiQuizModel
