const data = require('./data')
const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})