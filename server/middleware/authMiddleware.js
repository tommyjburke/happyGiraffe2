// validates the authentication token by decrypting and checking if it has expired
// the logic to decrypt the token Then send a response

const jwt = require('jsonwebtoken')

// request = get headers. response to frontend. next = what to do if token is valid

// module.exports = (req, res, next) => {
//    try {
//       const token = req.headers.authorization.split(' ')[1]
//       const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
//       const userId = decodedToken.userId
//       req.body.userId = userId
//       console.log('~~~ AUTH USER ID ~~~~ ', userId)
//       next()
//    } catch (error) {
//       res.status(401).send({
//          message: 'You have not logged in OR there is an authentication issue',
//          data: error,
//          success: false,
//       })
//    }
// }

module.exports = (req, res, next) => {
   const authHeader = req.headers.authorization
   // console.log('*** MIDDLEWARE START ***')
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // console.log('*** MIDDLEWARE ERROR: NO AUTH HEADER ***')
      return res.status(401).send({
         message: 'NOT SIGNED IN',
         success: false,
      })
   }

   const token = authHeader.substring('Bearer '.length)
   try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      // console.log('**** MIDDLEWARE DECODED TOKEN: ***** ', decodedToken)
      req.body.userId = decodedToken.userId
      // console.log('**** MIDDLEWARE USERID: ***** ' + req.body.userId)
      // console.log('*** MIDDLEWARE END ***')
      next()
   } catch (error) {
      // console.log('*** MIDDLEWARE ERROR: INVALID TOKEN ***', error)
      res.status(401).send({
         message: 'AuthenticaTION FAILED',
         data: error,
         success: false,
      })
   }
}
