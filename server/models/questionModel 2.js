const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
   {
      question: {
         type: String,
         required: true,
      },
      correctOption: {
         type: String,
         required: true,
      },
      options: {
         type: Object,
         required: true,
      },
      multi: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'multis',
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const QuestionModel = mongoose.model('questions', questionSchema)
module.exports = QuestionModel
