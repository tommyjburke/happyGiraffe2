const router = require('express').Router()
const MathsQuizModel = require('../models/mathsQuizModel')
const AssignmentModel = require('../models/assignmentModel')
const MultiQuizModel = require('../models/multiQuizModel')
const GroupModel = require('../models/groupModel')
const UserModel = require('../models/userModel')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/add-assignment', authMiddleware, async (req, res) => {
   const { quizType, assignedTo, teacherId, quizId } = req.body

   try {
      const newAssignment = new AssignmentModel({
         quizType,
         quizId,
         assignedTo,
         teacherId,
      })

      await newAssignment.save()
      res.send({
         message: 'Assignment added successfully',
         success: true,
      })
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

module.exports = router
