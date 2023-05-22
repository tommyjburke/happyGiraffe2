const mongoose = require('mongoose')

const UserModel = require('../models/userModel')
const Schema = mongoose.Schema

const emailVerificationSchema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'UserModel',
         required: true,
      },
      token: {
         type: String,
         required: true,
      },
      createAt: {
         type: Date,
         expires: 7200, // 2 hours
         default: Date.now(),
      },
   },
   {
      timestamps: true,
   }
)
