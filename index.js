require('dotenv').config({ path: './config.env'})
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(morgan((tokens, req, res) => {
  return [
    `Method: ${tokens.method(req, res)}`,
    `URL: ${tokens.url(req, res)}`,
    `Status code: ${tokens.status(req, res)}`,
    `Content length: ${tokens.res(req, res, 'content-length')}`,
    `Time: ${tokens['response-time'](req, res)} ms`,
    `Body: ${JSON.stringify(req.body)}`,
    '---------------',
  ].join('\n')
}))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const time = new Date()
  Person
    .countDocuments({})
    .then((count) => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      `)
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return body.name ? 
      response.status(400).json({
        error: 'number missing'
      }) : 
      response.status(400).json({
        error: 'name missing'
      })
  }

  Person
    .exists({ name: body.name })
    .then(person => {
      if (person) {
        return response.status(400).json({
          error: 'that person is in the phonebook'
        })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person.save().then(savedPerson => {
          response.json(savedPerson)
        })
      }
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .deleteOne({ _id: request.params.id })
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})