const data = require('./data')
const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})