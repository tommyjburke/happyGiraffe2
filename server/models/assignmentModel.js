const mongoose = require('mongoose')
const MathsQuizModel = require('../models/mathsQuizModel')
const MultiQuizModel = require('../models/multiQuizModel')
const GroupModel = require('../models/groupModel')
const UserModel = require('../models/userModel')
const Schema = mongoose.Schema

const assignmentSchema = new Schema(
   {
      assignmentTitle: {
         type: String,
         required: true,
      },
      quizType: {
         type: String,
         enum: ['maths', 'multi'],
         required: true,
      },
      quizId: {
         type: Schema.Types.ObjectId,
         ref: 'MathsQuizModel' || 'MultiQuizModel',
         required: true,
      },
      teacherId: {
         type: Schema.Types.ObjectId,
         ref: 'UserModel',
         required: true,
      },
      groupId: {
         type: Schema.Types.ObjectId,
         ref: 'GroupModel',
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const AssignmentModel = mongoose.model('assignments', assignmentSchema)

module.exports = AssignmentModel
