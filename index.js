const data = require('./data')
const express = require('express')
const app = express()

app.get('/api/persons', (request, response) => {
  response.json(data.numbers)
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