const router = require('express').Router()
const UserModel = require('../models/userModel')
const PupilModel = require('../models/pupilModel')
// const ConnectionModel = require('../models/connectionModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

router.post('/add-pupil', authMiddleware, async (req, res) => {
   const session = await mongoose.startSession()
   session.startTransaction()
   try {
      const { username, name, schoolName, className, birthYear, userId } = req.body
      const usernameExists = await UserModel.exists({ username })
      const pupilUsernameExists = await PupilModel.exists({ username })

      if (usernameExists || pupilUsernameExists) {
         return res
            .status(200)
            .send({ message: 'Username already exists', success: false })
      }

      const pupil = new PupilModel({
         username,
         name,
         schoolName,
         className,
         birthYear,
         guardianId: userId,
         connections: [userId],
      })

      // add the pupil to the guardian's pupils array and create connection documents in both directions
      const mainUserId = userId.toString()
      console.log('mainUserId', mainUserId)
      const mainUserFile = await UserModel.findById(mainUserId).session(session)
      if (!mainUserFile.pupils) {
         mainUserFile.pupils = [] // create pupils array if it doesn't exist
      }
      const pupilId = pupil._id.toString()
      mainUserFile.pupils.push(pupilId)
      mainUserFile.connections.push(pupilId)

      await Promise.all([pupil.save({ session }), mainUserFile.save({ session })])

      await session.commitTransaction()
      session.endSession()

      res.send({
         message: '*** Pupil added good good! ***',
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

router.post('/delete-pupil', authMiddleware, async (req, res) => {
   const { userId } = req.body
   const { pupilId } = req.body.pupilId

   console.log('userId', userId)
   console.log('pupilId', pupilId)

   const session = await mongoose.startSession()
   session.startTransaction()
   try {
      const pupil = await PupilModel.findByIdAndDelete(pupilId).session(session)

      if (!pupil) {
         return res.status(404).send({ message: 'Pupil not found', success: false })
      }

      const mainUserId = userId.toString()
      const mainUserFile = await UserModel.findById(mainUserId).session(session)

      if (!mainUserFile) {
         return res.status(404).send({ message: 'User not found', success: false })
      }

      const pupilIndex = mainUserFile.pupils.indexOf(pupilId)
      const connectionIndex = mainUserFile.connections.indexOf(pupilId)

      if (pupilIndex !== -1) {
         mainUserFile.pupils.splice(pupilIndex, 1)
      }

      if (connectionIndex !== -1) {
         mainUserFile.connections.splice(connectionIndex, 1)
      }

      await mainUserFile.save({ session })
      await session.commitTransaction()
      session.endSession()

      res.send({
         message: 'Pupil deleted successfully',
         success: true,
      })
   } catch (error) {
      await session.abortTransaction()
      session.endSession()
      res.status(500).send({
         message: 'Caught Server Error: ' + error.message,
         data: error,
         success: false,
      })
   }
})

router.post('/update-pupil', authMiddleware, async (req, res) => {
   try {
      await PupilModel.findByIdAndUpdate(req.body.pupilId, req.body)
      res.send({
         message: 'Pupil updated good good',
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
