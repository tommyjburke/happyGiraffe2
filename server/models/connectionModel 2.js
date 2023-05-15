const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionSchema = new Schema({
   userOrPupilId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
   },
   collectionType: {
      type: String,
      enum: ['user', 'pupil'],
      // required: true,
   },

   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
   },
   pupil: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PupilModel',
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
})

const ConnectionModel = mongoose.model('ConnectionModel', connectionSchema)

module.exports = ConnectionModel
