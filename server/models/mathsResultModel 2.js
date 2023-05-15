const mongoose = require('mongoose')

const mathsResultSchema = new mongoose.Schema(
   {
      type: {
         type: String,
      },
      mathsQuiz: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'mathsquizzes', // refer to export part of mathsModel.js
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
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
