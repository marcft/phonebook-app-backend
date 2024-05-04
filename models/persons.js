const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Could not connect to MongoDB:', err.message)
  })

const numberValidator = (value) => /^\d{2,3}-\d+$/.test(value)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "The person's name is too short, must be at least 3"],
    maxLength: [100, "The person's name is too long, must be less than 100"],
    required: true,
  },
  number: {
    type: String,
    minLength: [8, "The person's number is too short, must be at least 8"],
    validate: [numberValidator, "The person's number must begin with XX-X..."],
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
