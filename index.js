const data = require('./data')
const express = require('express')
const morgan = require('morgan')
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

app.get('/api/persons', (request, response) => {
  response.json(data.numbers)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.numbers.find(n => n.id === id)

  if (!person) {
    return response.status(400).send("<p>That person doesn't exist</p>")
  }

  response.json(person)
})

app.get('/info', (request, response) => {
  const time = new Date()
  response.send(`
  <p>Phonebook has info for ${data.numbers.length} people</p>
  <p>${time}</p>
  `)
})

const generateId = () => {
  return Math.floor(Math.random() * 999999)
}

const personInPhonebook = (name) => {
  return data.numbers.find(p => p.name === name)
}

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
  
  if (personInPhonebook(body.name)) {
    return response.status(400).json({
      error: 'name already in phonebook'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  data.numbers = data.numbers.concat(person)

  response.json(data.numbers)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data.numbers = data.numbers.filter(n => n.id !== id)
  
  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})