const mongoose = require('mongoose')

const multiResultsSchema = new mongoose.Schema(
   {
      assignmentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'assignments',
         required: true,
      },
      multiId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'multis',
         required: true,
      },
      pupilId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'pupils',
         required: true,
      },
      pupilName: {
         type: String,
      },
      result: {
         type: Object,
         required: true,
      },
      stats: {
         type: Object,
         required: true,
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
      },
   },
   {
      timestamps: true,
   }
)

const MultiResultModel = mongoose.model('multiResults', multiResultsSchema)

module.exports = MultiResultModel
