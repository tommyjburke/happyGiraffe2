const UserModel = require('../models/userModel')
const authMiddleware = require('../middleware/authMiddleware')
const router = require('express').Router()

// Get all users connections
router.post('/get-all-connections', authMiddleware, async (req, res) => {
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

// router.post('/get-all-connections', authMiddleware, async (req, res) => {
//    const userId = req.body.userId
//    try {
//       console.log('req user id', userId)
//       const user = await UserModel.findById(userId)
//       if (!user) {
//          return { message: 'user not found' }
//       }
//       res.json(user.connections)
//    } catch (error) {
//       console.log(error)
//       res.status(500).send({
//          message: error.message,
//          data: error,
//          success: false,
//       })
//    }
// })

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

module.exports = router
