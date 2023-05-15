const router = require('express').Router()
const MathsQuizModel = require('../models/mathsQuizModel')
const AssignmentModel = require('../models/assignmentModel')
const authMiddleware = require('../middleware/authMiddleware')
const GroupModel = require('../models/groupModel')

router.post('/add-group', authMiddleware, async (req, res) => {
   const { groupName, groupMembers, description, teacherId } = req.body

   try {
      const newGroup = new GroupModel({
         groupName,
         groupMembers,
         description,
         teacherId,
      })
      await newGroup.save()
      res.send({
         message: 'Group or Class added good good',
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

// router.post('/get-all-groups', authMiddleware, async (req, res) => {
//    try {
//       const groups = await GroupModel.find({})
//       res.send({
//          message: 'All Groups retrieved good good',
//          data: groups,
//          success: true,
//       })
//    } catch (error) {
//       res.status(500).send({
//          message: 'bang bang no good',
//          message: error.message,
//          data: error,
//          success: false,
//       })
//    }
// })

// router.post('/get-group-by-id', authMiddleware, async (req, res) => {
//    try {
//       const group = await GroupModel.findById(req.body.id)
//       res.send({
//          message: 'Group retrieved good good',
//          data: group,
//          success: true,
//       })
//    } catch (error) {
//       res.status(500).send({
//          message: 'bang bang no good',
//          message: error.message,
//          data: error,
//          success: false,
//       })
//    }
// })

router.post('/get-all-groups-by-teacher-id', authMiddleware, async (req, res) => {
   try {
      console.log('GET GROUPS ENDPOINT', req.body.userId)
      const group = await GroupModel.find({ teacherId: req.body.userId }).populate(
         'groupMembers'
      )
      res.send({
         message: 'Group retrieved good good',
         data: group,
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

router.post('/get-all-groups-by-teacher-id', authMiddleware, async (req, res) => {
   try {
      const group = await GroupModel.find({ teacherId: req.user.id })
      res.send({
         message: 'Group retrieved good good',
         data: group,
         success: true,
      })
   } catch (error) {
      res.status(500).send({
         message: 'bang bang no good',
         data: error,
         success: false,
      })
   }
})

// router.post('/get-group-by-pupil-id', authMiddleware, async (req, res) => {
//    try {
//       const group = await GroupModel.find({ groupMembers: req.body.pupilId })
//       res.send({
//          message: 'Group retrieved good good',
//          data: group,
//          success: true,
//       })
//    } catch (error) {
//       res.status(500).send({
//          message: 'bang bang no good',
//          message: error.message,
//          data: error,
//          success: false,
//       })
//    }
// })

// // update group
// router.post('/update-group', authMiddleware, async (req, res) => {
//    try {
//       await GroupModel.findByIdAndUpdate(req.body.groupId, req.body)
//       res.send({
//          message: 'Group updated good good',
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

// // delete group by Id
// router.post('/delete-group-by-id')
// try {
//    const groupId = req.body.groupId
//    await GroupModel.findByIdAndDelete(groupId)
//    res.send({
//       message: 'Group deleted good good',
//       success: true,
//    })
// } catch (error) {
//    res.status(500).send({
//       message: error.message,
//       data: error,
//       success: false,
//    })
// }

module.exports = router
