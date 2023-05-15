const router = require('express').Router()
const UserModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')
const bodyParser = require('body-parser')

const PupilModel = require('../models/pupilModel')
const ConnectionModel = require('../models/connectionModel')

// user registration ENDPOINT

router.post('/register', async (req, res) => {
   try {
      // check if user already exists
      const userExists = await UserModel.findOne({ email: req.body.email })
      if (userExists) {
         return res.status(200).send({ message: 'User already exists', success: false })
      }

      // hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      req.body.password = hashedPassword

      const { isTeacher } = req.body

      // create new user in db
      const newUser = new User(req.body)
      await newUser.save()
      res.send({
         message: 'User created good good',
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

// user login ENDPOINT

router.post('/login', async (req, res) => {
   try {
      // check if user exists
      const user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
         return res.status(200).send({ message: 'User does not exist', success: false })
      }

      // check password
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if (!validPassword) {
         return res.status(200).send({ message: 'Invalid password', success: false })
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: '10d',
      })

      res.send({
         message: 'User logged in good good',
         success: true,
         data: token,
      })
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// get user info ENDPOINT

router.post('/get-user-info', authMiddleware, async (req, res) => {
   try {
      const user = await UserModel.findById(req.body.userId)
      res.send({
         message: 'User info retrieved good good',
         success: true,
         data: user,
      })
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})

// Search for a user by username or email and send a connection request
router.post('/users/search', async (req, res) => {
   try {
      const { query, requestingUserId } = req.body

      const user = await UserModel.findOne({
         $or: [{ email: query }, { username: query }],
      })

      if (!user) {
         return res.status(404).send({ message: 'User not found', success: false })
      }

      // Check if the user being requested is already connected
      if (user.connections.includes(requestingUserId)) {
         return res
            .status(400)
            .send({ message: 'You are already connected to this user', success: false })
      }

      // Check if the user has already sent a connection request
      if (user.connectionRequests.some((req) => req.userId == requestingUserId)) {
         return res.status(400).send({
            message: 'You have already sent a connection request to this user',
            success: false,
         })
      }

      // Add the connection request to the requested user's account
      user.connectionRequests.push({ userId: requestingUserId })
      await user.save()

      res.status(201).send('Connection request sent')
   } catch (error) {
      res.status(400).send(error)
   }
})

// Accept or decline a connection request
router.post('/users/:userId/connection-requests/:requestId', async (req, res) => {
   try {
      const { accept } = req.body
      const { userId, requestId } = req.params

      const user = await UserModel.findById(userId)

      if (!user) {
         return res.status(404).send('User not found')
      }

      const request = user.connectionRequests.id(requestId)
      if (!request) {
         return res.status(404).send('Connection request not found')
      }

      if (accept) {
         // Add the requesting user to the user's connections
         user.connections.push(request.userId)

         // Add the user to the requesting user's connections
         const requestingUser = await User.findById(request.userId)
         requestingUser.connections.push(user._id)

         // Remove the connection request from the user's account
         request.remove()

         await requestingUser.save()
      } else {
         // Remove the connection request from the user's account
         request.remove()
      }

      await user.save()

      res.send('Connection request updated')
   } catch (error) {
      res.status(400).send(error)
   }
})

// Get all connections from connected users and get all JSON data for connected users

// router.get('/:userId/my-connections', authMiddleware, async (req, res) => {
//    try {
//       const { userId } = req.params
//       const user = await UserModel.findById(userId)
//       const connections = user.connections
//       console.log('user connections', connections)
//       const pupils = []

//       for (const connection of connections) {
//          const pupil = await PupilModel.findOne({ _id: connection._id })
//          console.log('pupil', pupil)
//          pupils.push({ username: pupil.username, fullName: pupil.fullName })
//       }

//       res.json(pupils)
//    } catch (err) {
//       console.error(err)
//       res.status(500).send('Server Error')
//    }
// })

router.post('/get-all-connections', authMiddleware, async (req, res) => {
   try {
      const userId = req.body.userId
      // console.log('USERID ', userId)
      const user = await UserModel.findById(userId)
      const connections = user.connections
      // console.log('user connections', connections)
      const pupils = []

      for (const connection of connections) {
         const pupil = await PupilModel.findOne({ _id: connection._id })
         // console.log('pupil', pupil)
         pupils.push({
            pupilId: pupil._id,
            username: pupil.username,
            name: pupil.name,
            schoolName: pupil.schoolName,
            className: pupil.className,
            role: 0,
         })
      }
      res.send({
         message: 'User connections retrieved good good',
         success: true,
         data: pupils,
      })
   } catch (err) {
      console.error(err)
      res.status(500).send('Server Error')
   }
})

// retrieve pupils created by user
router.post('/get-my-pupils', authMiddleware, async (req, res) => {
   try {
      const userId = req.body.userId
      // console.log('USERID ', userId)
      const user = await UserModel.findById(userId)
      const userPupils = user.pupils
      // console.log('user pupils', userPupils)
      const myPupils = []

      for (const userPupil of userPupils) {
         const myPupil = await PupilModel.findOne({ _id: userPupil._id })
         // console.log('myPupil', myPupil)
         myPupils.push({
            pupilId: userPupil._id,
            username: myPupil.username,
            name: myPupil.name,
            schoolName: myPupil.schoolName,
            className: myPupil.className,
            role: 0,
         })
      }
      // console.log('myPupils: ', myPupils)

      res.send({
         message: 'My pupils retrieved good good',
         success: true,
         data: myPupils,
      })
   } catch (err) {
      console.error(err)
      res.status(500).send('Server Error')
   }
})

module.exports = router

// get all users email and name and id
router.post('/get-all-users', async (req, res) => {
   try {
      const users = await UserModel.find()
      const usersData = users.map((user) => {
         return {
            userId: user._id,
            name: user.name,
            email: user.email,
         }
      })
      res.send({
         // message: 'Users retrieved good good',
         success: true,
         data: usersData,
      })
   } catch (error) {
      res.status(500).send({
         message: error.message,
         data: error,
         success: false,
      })
   }
})
