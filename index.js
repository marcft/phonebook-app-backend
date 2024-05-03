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

app.get('/api/info', (request, response) => {
  Note.find()
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${persons.length}</p>
      <p>${new Date().toString()}</p>`
      )
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
  Note.find()
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((res) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(404).json({ error: 'Content missing' })
  }

  const newPerson = new Note({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((res) => {
      response.json(res)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(404).json({ error: 'Content missing' })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Note.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((newPerson) => {
      response.json(newPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(`${error.name} from the errorHandler:`, error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
