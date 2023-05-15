const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionRequestSchema = new Schema({
   initiatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
   },
   targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
   targetType: {
      type: String,
      required: true,
      enum: ['User', 'Pupil'],
   },
   status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
   },
   created_at: {
      type: Date,
      default: Date.now(),
   },
})

const ConnectionModel = mongoose.model('connectionrequests', connectionRequestSchema)

module.exports = ConnectionRequestModel
