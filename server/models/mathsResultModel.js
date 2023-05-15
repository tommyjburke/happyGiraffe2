const mongoose = require('mongoose')

const mathsResultSchema = new mongoose.Schema(
   {
      pupilId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'pupils',
         required: true,
      },
      pupilName: {
         type: String,
      },
      assignmentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'assignments',
         // required: true,
      },
      type: {
         type: String,
         default: 'maths',
      },
      mathsQuiz: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'mathsquizzes', // refer to export part of mathsModel.js
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
      },

      pupilName: {
         type: String,
      },

      divsData: {
         type: Object,
         required: true,
      },
      stats: {
         type: Object,
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const MathsResultModel = mongoose.model('mathsresults', mathsResultSchema)

module.exports = MathsResultModel
