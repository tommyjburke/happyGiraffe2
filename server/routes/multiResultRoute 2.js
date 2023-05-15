const authMiddleware = require('../middleware/authMiddleware')
const MultiQuiz = require('../models/multiQuizModel')
const User = require('../models/userModel')
const MultiResult = require('../models/multiResultModel')
const router = require('express').Router()

// add multi result

router.post('/add-multi-result', authMiddleware, async (req, res) => {
   try {
      const newMultiResult = new MultiResult(req.body)
      await newMultiResult.save()
      res.send({
         message: 'Attempt added successfully',
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

// get all multiResults

router.post('/get-all-multi-result', authMiddleware, async (req, res) => {
   try {
      const { multiName, userName } = req.body

      // destructure user and multi data from req.body regex=contains
      const multis = await MultiResult.find({
         name: {
            $regex: multiName,
         },
      })

      const matchedMultiIds = multis.map((multi) => multi._id)

      const users = await User.find({
         name: {
            $regex: userName,
         },
      })

      const matchedUserIds = users.map((user) => user._id)

      const multiResults = await MultiResult.find({
         multi: {
            $in: matchedMultiIds,
         },
         user: {
            $in: matchedUserIds,
         },
      })
         .populate('multi')
         .populate('user')
         .sort({ createdAt: -1 })
      res.send({
         message: 'Attempts fetched successfully',
         data: multiResults,
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

// get all multiResults by user
router.post('/get-all-multi-result-by-user', authMiddleware, async (req, res) => {
   try {
      const multiResults = await MultiResult.find({ user: req.body.userId })
         .populate('multi')
         .populate('user')
         .sort({ createdAt: -1 })
      res.send({
         message: 'Results retrieved success',
         data: multiResults,
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

// delete multi result by id

router.post('/delete-multi-result-by-id', authMiddleware, async (req, res) => {
   try {
      await MultiResult.findByIdAndDelete(req.body.multiResultId)
      res.send({
         message: 'Multi-Choice Result deleted successfully',
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
