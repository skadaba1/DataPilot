// bookshelf-app/server/controllers/books-controller.js

// Import database
const knex = require('./../db')

// Retrieve all books
exports.logsAll = async (req, res) => {
  // Get all books from database
  knex
    .select('*') // select all records
    .from('Logs') // from 'books' table
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
  knex('Logs')
    .insert({ // insert new record, a book
      'session_content': req.body.session_content,
    })
    .then(() => {
      // Send a success message in response
      //console.log(req.body.id)
      res.json({ message: `session with id \'${req.body.id}\' created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating session with id: ${req.body.id}` })
    })
}

// Remove specific book
exports.logsDelete = async (req, res) => {
  // Find specific book in the database and remove it
  knex('Logs')
    .where('id', req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Session ${req.body.id} deleted.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error deleting ${req.body.id} Log: ${err}` })
    })
}

// Remove all books on the list
exports.logsDeleteAll = async (req, res) => {
  // Remove all books from database
  knex
    .select('*') // select all records
    .from('Logs') // from 'books' table
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

// Remove all books on the list
// Remove all books on the list
exports.logsReset = async (req, res) => {
  try {
    // Get the count of rows in the 'Logs' table
    const rowCount = await knex('Logs').count('* as count').first();
    // If the count exceeds 10, calculate the number of entries to delete
    if (rowCount.count > 10) {
      const deleteCount = rowCount.count - 10;

      // Get the IDs of the oldest entries to delete
      const oldestEntries = await knex('Logs')
        .orderBy('id', 'asc')
        .limit(deleteCount)
        .pluck('id');

      // Delete the oldest entries
      await knex('Logs')
        .whereIn('id', oldestEntries)
        .del();
    }

    // Send a success message in response
    res.json({ message: 'Logs cleared.' });
  } catch (error) {
    // Send an error message in response
    res.json({ message: `There was an error resetting log list: ${error}.` });
  }
}
