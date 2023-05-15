const express = require('express')
const app = express()
require('dotenv').config()

const dbConfig = require('./config/dbConfig')

const usersRoute = require('./routes/usersRoute')
const multiQuizRoute = require('./routes/multiQuizRoute')
const multiResultRoute = require('./routes/multiResultRoute')
const mathsResultRoute = require('./routes/mathsResultRoute')
const mathsQuizRoute = require('./routes/mathsQuizRoute')
const pupilsRoute = require('./routes/pupilsRoute')
const connectionsRoute = require('./routes/connectionsRoute')
const assignmentRoute = require('./routes/assignmentRoute')
const groupRoute = require('./routes/groupRoute')

app.use(express.json())
app.use('/api/users', usersRoute)
app.use('/api/multi-quiz', multiQuizRoute)
app.use('/api/multi-result', multiResultRoute)
app.use('/api/maths-result', mathsResultRoute)
app.use('/api/maths-quiz', mathsQuizRoute)
app.use('/api/pupils', pupilsRoute)
app.use('/api/connections', connectionsRoute)
app.use('/api/assignments', assignmentRoute)
app.use('/api/groups', groupRoute)

const port = process.env.PORT || 5002

const path = require('path')

__dirname = path.resolve()

app.listen(port, () => console.log(`app listening on port ${port}!`))
console.log('********** Mongo URL below: ***********')
console.log(process.env.MONGO_URL)

// app.use(express.json()) // to destructure JSON variables

// app.listen(3000, () => console.log(`app listening on port ${port}!`))
