const mongoose = require('mongoose')

const multiResultsSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
      },
      multi: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'multis',
      },
      result: {
         type: Object,
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const MultiResultModel = mongoose.model('multiResults', multiResultsSchema)

module.exports = MultiResultModel
