const mongoose = require('mongoose')
const AssignmentModel = require('../models/assignmentModel')
const PupilModel = require('../models/pupilModel')
const Schema = mongoose.Schema

const groupSchema = new Schema(
   {
      teacherId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserModel',
      },
      groupName: {
         type: String,
         required: true,
      },
      groupMembers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pupils',
         },
      ],
      description: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
)

const GroupModel = mongoose.model('GroupModel', groupSchema)

module.exports = GroupModel
