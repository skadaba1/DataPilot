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
      'name': req.body.name,
      'task': req.body.task,
      'datasets': req.body.datasets
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

// Update an entry with the specified ID
exports.updateEntry = async (req, res) => {
  try {
    // Update the entry with the specified ID in the 'Logs' table
    const id = req.body.id;
    const session_content = req.body.session_content;
    const name = req.body.name;
    const task = req.body.task;
    const datasets = req.body.datasets

    const currentLog = await knex('Logs')
      .where('id', id)
      .first(); // Retrieve the first matching entry
    // Create an object to hold the fields you want to update
    const updateFields = {};

    if (session_content !== undefined) {
      updateFields.session_content = session_content;
    }

    if (name !== undefined) {
      updateFields.name = name;
    }

    if (task !== undefined) {
      updateFields.task = task;
    }

    if (datasets !== undefined) {
      updateFields.datasets = currentLog.datasets + datasets;
    }

    // Update the entry with the specified ID in the 'Logs' table, but only update the specified fields
    await knex('Logs')
      .where('id', req.body.id)
      .update(updateFields);

    // Send a success message in response
    res.json({ message: `Entry with ID ${req.body.id} updated.` });
  } catch (error) {
    // Send an error message in response
    res.json({ message: `There was an error updating the entry: ${error}` });
  }
}

// Fetch the most recently added entry
exports.fetchLatestEntry = async (req, res) => {
  try {
    // Get the most recently added entry from the 'Logs' table
    const latestEntry = await knex('Logs')
      .select('id', '*') 
      .orderBy('id', 'desc')
      .first();

    // Send the latest entry in the response
    res.json(latestEntry);
  } catch (error) {
    // Send an error message in response
    res.json({ message: `There was an error retrieving the latest entry: ${error}` });
  }
}

// Fetch the most recently added entry
exports.fetchOne = async (req, res) => {
  try {
    // Get the most recently added entry from the 'Logs' table
    const entry = await knex('Logs')
      .where('id', req.query.id)
      .first() // Get the first matching entry
      .select('id', '*'); // Include all columns here

    // Send the latest entry in the response
    res.json(entry);
  } catch (error) {
    // Send an error message in response
    res.json({ message: `There was an error retrieving the selected entry: ${error}` });
  }
}



