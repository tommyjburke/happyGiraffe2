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

module.exports = router
