const UserModel = require('../models/userModel')
const PupilModel = require('../models/pupilModel')
const ConnectionModel = require('../models/connectionModel')
const authMiddleware = require('../middleware/authMiddleware')
const router = require('express').Router()
const mongoose = require('mongoose')

// Get all users connections
router.post('/get-all-connections', authMiddleware, async (req, res) => {
   console.log('get-all-connections')
   const userId = req.body.userId
   try {
      // console.log('req user id', userId)
      const user = await UserModel.findById(userId).populate({
         path: 'connections',
         model: 'ConnectionModel',
         populate: {
            path: 'targetId',
            model: 'UserModel',
         },
      })

      if (!user) {
         return { message: 'user not found' }
      }
      res.json(user.connections)
   } catch (error) {
      // console.log(error)
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// Get all pupils
router.get('/get-all-pupils', authMiddleware, async (req, res) => {
   try {
      const user = await UserModel.findById(req.user.id).populate('pupils')
      if (!user) {
         return res.status(404).json({ message: 'User not found' })
      }
      res.json(user.pupils)
   } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server Error' })
   }
})

router.post('/get-connections-by-pupil-id', authMiddleware, async (req, res) => {
   console.log('get-connections-by-pupil-id')
   console.log('req.body', req.body)

   try {
      const pupilId = req.body.pupilId
      const pupil = await PupilModel.findById(pupilId)
      const pupilConnections = pupil.connections // Get the array of connection IDs

      const userConnections = await UserModel.find({
         _id: { $in: pupilConnections }, // use ids from pupilConns to search userModel
      }).select('name role') // Select only name + role fields

      res.send({
         message: 'Pupil connections retrieved good good',
         success: true,
         data: userConnections,
      })
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

router.post('/add-connection', authMiddleware, async (req, res) => {
   console.log('add-connection')
   const session = await mongoose.startSession()
   session.startTransaction()
   try {
      const { teacherId, pupilId } = req.body

      const teacherFile = await UserModel.findById(teacherId)
      console.log('TEACHERFILE: ', teacherFile)
      const pupilFile = await PupilModel.findById(pupilId)
      console.log('PUPILFILE: ', pupilFile)
      if (!teacherFile.connections) {
         teacherFile.connections = [] // Create the connections field if it doesn't exist
      }
      if (!pupilFile.connections) {
         pupilFile.connections = [] // Create the connections field if it doesn't exist
      }

      teacherFile.connections.push(pupilId)
      pupilFile.connections.push(teacherId)

      await Promise.all([teacherFile.save({ session }), pupilFile.save({ session })])

      await session.commitTransaction()
      session.endSession()

      res.send({
         message: 'Connection added good good',
         success: true,
      })
   } catch (error) {
      await session.abortTransaction()
      session.endSession()
      res.status(500).send({
         message: 'Caught Server Error' + error.message,
         data: error,
         success: false,
      })
   }
})

module.exports = router
