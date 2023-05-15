const router = require('express').Router()
const MathsQuizModel = require('../models/mathsQuizModel')
const AssignmentModel = require('../models/assignmentModel')
const MultiQuizModel = require('../models/multiQuizModel')
const GroupModel = require('../models/groupModel')
const UserModel = require('../models/userModel')
const PupilModel = require('../models/pupilModel')
const MathsResultModel = require('../models/mathsResultModel')
const MultiResultModel = require('../models/multiResultModel')

const authMiddleware = require('../middleware/authMiddleware')

router.post(
   '/get-pupil-results-by-teacher-and-assignment-id',
   authMiddleware,
   async (req, res) => {
      const { userId } = req.body
      try {
         const assignments = await AssignmentModel.find({ teacherId: userId })
         console.log('assignments', assignments)

         const { groupId, quizType, quizId } = assignments
         console.log('groupId, quizType, quizId', groupId, quizType, quizId)

         const group = await GroupModel.findById(groupId)

         const pupilDocuments = []
         for (const memberId of group.groupMembers) {
            const pupil = await PupilModel.findById(memberId)
            pupilDocuments.push(pupil)
         }

         for (const pupil of pupilDocuments) {
            if (quizType === 'maths') {
               const result = await MathsResultModel.findOne({
                  assignmentId: assignmentId,
                  pupilId: pupil.id,
               })
               if (result) {
                  mathsResults.push(result)
               } else {
                  mathsResults.push({ quiz: { title: 'not completed' } })
               }
            }
         }

         const multiResults = []
         for (const pupil of pupilDocuments) {
            if (quizType === 'multi') {
               const result = await MultiResultModel.findOne({
                  assignmentId: assignmentId,
                  pupilId: pupil.id,
               })
               if (result) {
                  multiResults.push(result)
               } else {
                  multiResults.push({ quiz: { title: 'not completed' } })
               }
            }
         }

         res.send({ mathsResults, multiResults })
      } catch (error) {
         res.status(500).send({
            message: error.message,
            data: error,
            success: false,
         })
      }
   }
)

router.post('/get-multis-maths-groups', authMiddleware, async (req, res) => {
   const { userId } = req.body

   try {
      const multis = await MultiQuizModel.find({ userId })
      const mathsQuizzes = await MathsQuizModel.find({ userId })
      const groupModels = await GroupModel.find({ userId })

      // const groups = groupModels.map((group) => {
      //    return {
      //       _id: group._id,
      //       name: group.name,
      //       quizzes: group.quizzes,
      //    }
      // })

      res.send({
         multis,
         mathsQuizzes,
         groupModels,
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

router.post('/add-assignment', authMiddleware, async (req, res) => {
   const { quizType, groupId, teacherId, quizId, assignmentTitle } = req.body

   try {
      const newAssignment = new AssignmentModel({
         assignmentTitle,
         quizType,
         quizId,
         teacherId,
         groupId,
      })

      await newAssignment.save()
      res.send({
         message: 'Assignment added good good',
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

router.post('/get-assignments-by-teacher-id', authMiddleware, async (req, res) => {
   console.log('req.body', req.body)
   console.log('req.body.userId', req.body.userId)
   const teacherId = req.body.userId
   console.log('teacherId', teacherId)

   try {
      const assignments = await AssignmentModel.find({ teacherId }).populate('groupId')
      const updatedAssignments = await Promise.all(
         assignments.map(async (assignment) => {
            if (assignment.quizType === 'maths') {
               const quiz = await MathsQuizModel.findOne({ quizId: assignment.quizId })
               if (quiz) {
                  return {
                     ...assignment.toObject(),
                     quizTitle: quiz.gameOptions.title,
                  }
               }
            } else if (assignment.quizType === 'multi') {
               const quiz = await MultiQuizModel.findOne({ quizId: assignment.quizId })
               if (quiz) {
                  return {
                     ...assignment.toObject(),
                     quizTitle: quiz.title,
                  }
               }
            }
            return assignment
         })
      )
      res.send({
         message: 'Assignments retrieved good good',
         data: updatedAssignments,
         success: true,
      })
      console.log('assignments', updatedAssignments)
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

router.post('/delete-assignment', authMiddleware, async (req, res) => {
   const { assignmentId } = req.body

   try {
      await AssignmentModel.findByIdAndDelete(assignmentId)
      res.send({
         message: 'Assignment deleted good good',
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

router.post('/get-assignments-by-pupil-id', authMiddleware, async (req, res) => {
   console.log('get-assignments-by-pupil-id')
   console.log('req.body', req.body)
   const { pupilId } = req.body

   try {
      const groupModels = await GroupModel.find({
         groupMembers: {
            $elemMatch: { $eq: pupilId },
         },
      })
      const groupModelIds = groupModels.map((g) => g._id)
      const assignments = await AssignmentModel.find({
         groupId: { $in: groupModelIds },
      })
      const quizIds = assignments.map((a) => a.quizId)
      const quizTypes = [...new Set(assignments.map((a) => a.quizType))]

      console.log('groupModels', groupModels)
      console.log('assignments', assignments)
      console.log('quizIds', quizIds)
      console.log('quizTypes', quizTypes)

      if (assignments.length === 0) {
         return res.status(404).send({
            message: `No assignments currently set for pupil ${pupilId}`,
            // data: {},
            // success: false,
         })
      }
      const quizData = {}
      for (const quizType of quizTypes) {
         if (quizType === 'maths') {
            const mathsQuizzes = await MathsQuizModel.find({ _id: { $in: quizIds } })
            quizData.maths = mathsQuizzes
         } else if (quizType === 'multi') {
            const multiQuizzes = await MultiQuizModel.find({ _id: { $in: quizIds } })
            quizData.multi = multiQuizzes
         }
      }
      const assignmentsData = await Promise.all(
         assignments.map(async (assignment) => {
            const teacher = await UserModel.findOne({ _id: assignment.teacherId })
            const teacherName = teacher.name

            const quiz = quizData[assignment.quizType].find(
               (q) => q._id.toString() === assignment.quizId.toString()
            )
            return {
               ...assignment.toObject(),
               teacher: teacherName,
               quiz,
            }
         })
      )
      res.send({
         message: 'Assignments retrieved good good',
         data: assignmentsData,
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

// use assignmentId to check if submitted in results based on maths or multi

router.post('/get-assignment-status', authMiddleware, async (req, res) => {
   const { assignmentId } = req.body

   try {
      const assignments = await AssignmentModel.find({ _id: assignmentId })
      const assignment = assignments[0]
      const { quizType, quizId } = assignment
      if (quizType === 'maths') {
         const mathsResults = await MathsResultModel.find({ quizId })
         const mathsResult = mathsResults[0]
         if (mathsResult) {
            res.send({
               message: 'Assignment status ',
               data: 'Submitted',
               success: true,
            })
         } else {
            res.send({
               message: 'Assignment status ',
               data: 'Not Submitted',
               success: true,
            })
         }
      } else if (quizType === 'multi') {
         const multiResults = await MultiResultModel.find({ quizId })
         const multiResult = multiResults[0]
         if (multiResult) {
            res.send({
               message: 'Assignment status',
               data: 'Submitted',
               success: true,
            })
         } else {
            res.send({
               message: 'Assignment status retrieved good good',
               data: 'Not Submitted',
               success: true,
            })
         }
      }
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// use assignmentId to check if submitted in results based on maths or multi
router.post('/get-assignment-status-for-all-pupils', authMiddleware, async (req, res) => {
   const { assignmentId } = req.body
   console.log('assignmentId', assignmentId)

   try {
      const assignment = await AssignmentModel.findById(assignmentId)
      console.log('assignment', assignment)
      const { quizType, quizId, groupId } = assignment
      console.log('ASSIGNMENT quizType', quizType)
      console.log('ASSIGNMENT quizId', quizId)
      console.log('ASSIGNMENT groupId', groupId)
      console.log('ASSIGNMENT ID', assignmentId)
      const group = await GroupModel.findById({ _id: groupId })
      // console.log('group', group)
      // console.log('group', group)
      const groupMembers = group.groupMembers
      // console.log('GROUP MEMBERS:    ', groupMembers)

      console.log(' - - - - - - - - - - - - - - - - - - - ')

      const groupMembersData = await Promise.all(
         groupMembers.map(async (pupilId) => {
            // ********* IF MATHS RESULT ********

            if (quizType === 'maths') {
               const query = { assignmentId: assignmentId, pupilId: pupilId }
               const mathsResult = await MathsResultModel.findOne(query).populate(
                  'pupilId'
               )
               if (mathsResult) {
                  const date = mathsResult.createdAt
                  const pupil = await PupilModel.findById(pupilId)
                  const pupilName = pupil.name // Extract the pupilName from the Pupil model
                  return {
                     date,
                     pupilId,
                     pupilName,
                     status: 'Submitted',
                  }
               } else {
                  const pupil = await PupilModel.findById(pupilId)
                  const pupilName = pupil.name // Extract the pupilName from the Pupil model
                  return {
                     pupilId,
                     pupilName,
                     status: 'Not Submitted',
                  }
               }
            } else if (quizType === 'multi') {
               // ********* IF MULTI RESULT ********
               const query = { assignmentId: assignmentId, pupilId: pupilId }
               const multiResult = await MultiResultModel.findOne(query).populate(
                  'pupilId'
               )
               // console.log('~~~QUIZ ID', quizId)
               // console.log('~~~PUPIL ID', pupilId)
               // console.log('~~~~ MULTI RESULT', multiResult)
               // console.log('~~~~~ ASSIGNMENT ID: ', assignmentId)

               if (multiResult) {
                  const date = multiResult.createdAt
                  const pupil = await PupilModel.findById(pupilId)
                  const pupilName = pupil.name // Extract the pupilName from the Pupil model

                  console.log('~~~~~ PUPIL NAME: ', pupilName)

                  return {
                     date,
                     pupilId,
                     pupilName,
                     status: 'Submitted',
                  }
               } else {
                  const pupil = await PupilModel.findById(pupilId)
                  const pupilName = pupil ? pupil.name : '' // Extract the pupilName from the Pupil model if it exists
                  return {
                     pupilId: pupilId,
                     pupilName: pupilName,
                     status: 'Not Submitted',
                  }
               }
            }
         })
      )
      res.send({
         message: 'Assignment status retrieved good good',
         data: groupMembersData,
         assignment,
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
