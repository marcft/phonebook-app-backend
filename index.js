require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Note = require('./models/persons')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (request, response) => {
  Note.find().then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Note.findById(request.params.id).then((person) => {
    response.json(person)
  })
})

app.get('/api/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length}</p>
    <p>${new Date().toString()}</p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id).then((res) => {
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(404).json({ error: 'Content missing' })
  }

  const newPerson = new Note({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then((res) => {
    response.json(res)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
