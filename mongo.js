const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    'Arguments must be either: \n\tyourpassword \n\tyourpassword name number',
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@testcluster0.34msspu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=TestCluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = new mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
  Person.find().then((res) => {
    console.log('phonebook:')
    res.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({ name: process.argv[3], number: process.argv[4] })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
