const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pupilSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
      },
      name: {
         type: String,
         required: true,
      },
      role: {
         type: Number,
         default: 0,
         required: true,
      },
      schoolName: {
         type: String,
      },
      className: {
         type: String,
      },
      birthYear: {
         type: Number,
      },
      guardianId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'UserModel',
      },
      connections: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
      connectionRequests: [
         {
            fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
            message: { type: String },
            createdAt: { type: Date, default: Date.now },
            status: {
               type: String,
               enum: ['pending', 'accepted', 'declined'],
               default: 'pending',
            },
         },
      ],
   },

   {
      timestamps: true,
   }
)

const PupilModel = mongoose.model('pupils', pupilSchema)

module.exports = PupilModel
