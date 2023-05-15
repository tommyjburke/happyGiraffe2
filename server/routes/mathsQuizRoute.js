const router = require('express').Router()
const MathsQuizModel = require('../models/mathsQuizModel')
const authMiddleware = require('../middleware/authMiddleware')

// create API endpoint to add mathsQuiz
router.post('/add-maths-quiz', authMiddleware, async (req, res) => {
   const { divsData, gameOptions } = req.body
   const userId = req.body.userId

   try {
      const newMathsQuiz = new MathsQuizModel({
         divsData,
         teacherId: userId,
         gameOptions: {
            ...gameOptions,
         },
      })
      await newMathsQuiz.save()
      res.send({
         message: 'Maths Quiz added good good',
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

router.post('/get-all-maths-by-teacher-id', authMiddleware, async (req, res) => {
   const { userId } = req.body

   try {
      const mathsQuizzes = await MathsQuizModel.find({ 'gameOptions.userId': userId })
      res.send({
         message: 'All Maths Quizzes retrieved good good',
         data: mathsQuizzes,
         success: true,
      })
   } catch (error) {
      res.status(500).send({
         message: 'bang bang no good',
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// API endpoint get all maths quizzes
router.post('/get-all-maths', authMiddleware, async (req, res) => {
   try {
      const mathsQuizzes = await MathsQuizModel.find({})
      res.send({
         message: 'All Maths Quizzes retrieved good good',
         data: mathsQuizzes,
         success: true,
      })
   } catch (error) {
      res.status(500).send({
         message: 'bang bang no good',
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// get maths quiz by id
router.post('/get-maths-by-id', authMiddleware, async (req, res) => {
   try {
      const mathsQuiz = await MathsQuizModel.findById(req.body.id)
      res.send({
         message: 'Maths Quiz retrieved good good',
         data: mathsQuiz,
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

// delete maths quiz by id
// router.post('/delete-maths-by-id', authMiddleware, async (req, res) => {
//    try {

module.exports = router
