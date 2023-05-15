const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection

connection.on('connected', () => {
   console.log('Successfully connected to MongoDB')
})

connection.on('error', (error) => {
   console.log('Failed to connect to MongoDB')
})

module.exports = connection
