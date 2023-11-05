// bookshelf-app/server/controllers/books-controller.js

// Import database
const knex = require('../db')

// Retrieve all books
exports.logsAll = async (req, res) => {
  // Get all books from database
  knex
    .select('*') // select all records
    .from('logs') // from 'books' table
    .then(userData => {
      // Send books extracted from database in response
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving logs: ${err}` })
    })
}

// Create new book
exports.logsCreate = async (req, res) => {
  // Add new book to database
  knex('logs')
    .insert({ // insert new record, a book
      'role': req.body.role,
      'message': req.body.message,
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `role \'${req.body.role}\' created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating role: ${req.body.role}` })
    })
}

// Remove specific book
exports.logsDelete = async (req, res) => {
  // Find specific book in the database and remove it
  knex('logs')
    .where('id', req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Log ${req.body.id} deleted.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error deleting ${req.body.id} Log: ${err}` })
    })
}

// Remove all books on the list
exports.logsReset = async (req, res) => {
  // Remove all books from database
  knex
    .select('*') // select all records
    .from('logs') // from 'books' table
    .truncate() // remove the selection
    .then(() => {
      // Send a success message in response
      res.json({ message: 'Logs cleared.' })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error resetting log list: ${err}.` })
    })
}