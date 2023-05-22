const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      username: {
         type: String,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: Number,
         default: 1,
      },
      sharedRole: {
         type: String,
         required: true,
         enum: ['Guardian', 'Parent', 'Teacher'],
         default: 'Guardian',
      },
      myGroups: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GroupModel',
         },
      ],

      connections: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PupilModel',
         },
      ],
      connectionRequests: [
         {
            fromUser: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'UserModel',
            },
            fromPupil: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'PupilModel',
            },
            toUser: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'UserModel',
            },
            message: {
               type: String,
            },
            created_at: {
               type: Date,
               default: Date.now(),
            },
            status: {
               type: String,
               enum: ['pending', 'accepted', 'declined'],
               default: 'pending',
            },
         },
      ],
      pupils: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pupils',
            // ref: 'PupilModel',
         },
      ],
   },
   {
      timestamps: true,
   }
)

const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel
