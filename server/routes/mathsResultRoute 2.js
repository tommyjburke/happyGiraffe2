const authMiddleware = require('../middleware/authMiddleware')
const MathsQuizModel = require('../models/mathsQuizModel')
const User = require('../models/userModel')
const MathsResult = require('../models/mathsResultModel')
const router = require('express').Router()
const mongoose = require('mongoose')

// add result

router.post('/add-maths-result', authMiddleware, async (req, res) => {
   try {
      const newMathsResult = new MathsResult(req.body)
      await newMathsResult.save()
      res.send({
         message: 'Result saved!',
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

// get all results

router.post('/get-all-maths-results', authMiddleware, async (req, res) => {
   try {
      const { mathsQuizName, userName } = req.body

      // destructure user and mathsQuiz data from req.body regex=contains
      const mathsQuizs = await MathsQuizModel.find({
         name: {
            $regex: mathsQuizName,
         },
      })

      const matchedMathsQuizIds = mathsQuizs.map((mathsQuiz) => mathsQuiz._id)

      const users = await User.find({
         name: {
            $regex: userName,
         },
      })

      const matchedUserIds = users.map((user) => user._id)

      const results = await MathsResult.find({
         mathsQuiz: {
            $in: matchedMathsQuizIds,
         },
         user: {
            $in: matchedUserIds,
         },
      })
         .populate('mathsQuiz')
         .populate('user')
         .sort({ createdAt: -1 })
      res.send({
         message: 'Attempts fetched successfully',
         data: results,
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

// get all results by user
router.post('/get-all-maths-results-by-user', authMiddleware, async (req, res) => {
   try {
      const results = await MathsResult.find({ user: req.body.userId })
         .populate('mathsQuiz') // populate mathsQuiz field from Result
         .populate('user') // populate user field from Result
         .sort({ createdAt: -1 })
      res.send({
         message: 'Results retrieved success',
         data: results,
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

// delete result by id

router.post('/delete-maths-result-by-id', authMiddleware, async (req, res) => {
   try {
      await MathsResult.findByIdAndDelete(req.body.resultId)
      res.send({
         message: 'Result deleted successfully',
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
