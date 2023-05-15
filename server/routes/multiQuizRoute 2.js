const router = require('express').Router()
const MultiQuiz = require('../models/multiQuizModel')
const UserModel = require('../models/userModel')
const authMiddleware = require('../middleware/authMiddleware')
const Question = require('../models/questionModel')

// add multiple choice quiz

router.post('/add-multi-quiz', authMiddleware, async (req, res) => {
   const userId = req.body.userId

   try {
      req.body.questions = []

      const newMultiQuiz = new MultiQuiz({
         ...req.body,
         userId: userId,
      })
      await newMultiQuiz.save()
      res.send({
         message: 'Multiple Choice Quiz added successfully',
         success: true,
         data: newMultiQuiz._id.toString(), // Include the new _id field in the response
      })
      console.log('NEW MULTIQUIZ ID', newMultiQuiz._id.toString())
      console.log('NEW MULTIQUIZ DATA', newMultiQuiz)
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// get all multiple choice
// router.post('/get-all-multis', authMiddleware, async (req, res) => {
//    try {
//       const multis = await MultiQuiz.find({}).populate('userId', 'name') // populate user document and retrieve only the name field
//       res.send({
//          message: 'Multi Quizzes fetched successfully',
//          data: multis,
//          success: true,
//       })
//    } catch (error) {
//       res.status(500).send({
//          message: error.message,
//          data: error,
//          success: false,
//       })
//    }
// })

router.post('/get-all-multis', authMiddleware, async (req, res) => {
   try {
      const multis = await MultiQuiz.find({}).populate({
         path: 'userId',
         select: 'name',
         as: 'user',
         model: UserModel,
      })

      res.send({
         message: 'Multi Quizzes fetched successfully',
         data: multis,
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

// get multi by id
router.post('/get-multi-by-id', authMiddleware, async (req, res) => {
   try {
      const multi = await MultiQuiz.findById(req.body.multiId).populate('questions')

      // populate uses the REF field in the Question model to get the question
      res.send({
         message: 'MultiQuiz fetched successfully',
         data: multi,
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

// edit multi by id
router.post('/edit-multi-by-id', authMiddleware, async (req, res) => {
   try {
      await MultiQuiz.findByIdAndUpdate(req.body.multiId, req.body)
      res.send({
         message: 'MultiQuiz edited successfully',
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

// delete multi by id
router.post('/delete-multi-by-id', authMiddleware, async (req, res) => {
   try {
      const multiId = req.body.multiId
      // Delete all related questions from Questions table
      await Question.deleteMany({ multi: multiId })
      // Delete the multi object from MultiQuiz table
      await MultiQuiz.findByIdAndDelete(multiId)
      res.send({
         message: 'MultiQuiz and related questions deleted successfully',
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

// add question to multi

router.post('/add-question-to-multi', authMiddleware, async (req, res) => {
   try {
      // add question to Questions collection
      const newQuestion = new Question(req.body)
      const question = await newQuestion.save()

      // add question to multi
      const multi = await MultiQuiz.findById(req.body.multi)
      multi.questions.push(question._id)
      await multi.save()
      res.send({
         message: 'Question added successfully',
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

// edit question in multi
router.post('/edit-question-by-id', authMiddleware, async (req, res) => {
   try {
      // edit question in Questions collection
      await Question.findByIdAndUpdate(req.body.questionId, req.body)
      res.send({
         message: 'Question edited successfully',
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

// delete question in multi
router.post('/delete-question-in-multi', authMiddleware, async (req, res) => {
   try {
      // delete question in Questions collection
      await Question.findByIdAndDelete(req.body.questionId)

      // delete question in multi
      const multi = await MultiQuiz.findById(req.body.multiId)
      multi.questions = multi.questions.filter(
         (question) => question._id != req.body.questionId
      )
      await multi.save()
      res.send({
         message: 'Question deleted successfully',
         success: true,
      })
   } catch (error) {}
})

module.exports = router
