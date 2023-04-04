const data = require('./data')
const express = require('express')
const app = express()

app.get('/api/persons', (request, response) => {
  response.json(data.numbers)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})