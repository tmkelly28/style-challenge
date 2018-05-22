const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const {db, Entry} = require('./db')
const app = express()
const PORT = process.env.PORT || 3000

// Logging middleware
app.use(morgan('dev'))

// Body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// If you want to add routes, they should go here!
app.get('/api/entries', (req, res, next) => {
  Entry.findAll()
    .then(entries => res.json(entries))
    .catch(next)
})

app.post('/api/entries', (req, res, next) => {
  const {content} = req.body
  Entry.create({content})
    .then(entry => res.json(entry))
    .catch(next)
})

app.put('/api/entries/:entryId', (req, res, next) => {
  Entry.findById(req.params.entryId)
    .then(entry => {
      entry.votes++
      return entry.save()
    })
    .then(entry => res.json(entry))
    .catch(next)
})

// For all GET requests that aren't to an API route,
// we will send the index.html!
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'))
})

// Handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handling endware
app.use((err, req, res, next) => {
  console.error(err.message)
  console.error(err.stack)
  res.status(err.status || 500)
  res.send(err.message || 'Internal server error')
})

db.sync().then(() => console.log('The database is synced'))
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
