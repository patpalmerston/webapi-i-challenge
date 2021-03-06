// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();

server.use(express.json());

server.listen(4000, () => {
  console.log('\n***** Server running on localhost:4000 *****\n')
})

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
}

// Home endpoint
server.get('/', (req, res) => {
  res.send('Hello World')
})



//get posted data
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({
          success: true,
          error: "The users information could not be retrieved."
        })
    })
});

// endpoint by id
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({
          success: true,
          user
        })
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        })
      }
    })
    .catch(err => {
      res.status(500).json({
          success: false,
          error: "The user information could not be retrieved."
      })
    })
})


//Post to data
server.post('/api/users', (req, res) => {
  const { name, bio, created_at, updated_at } = req.body;
  if (!name || !bio) {
    sendUserError(400, 'Must provide name and bio', res);
    return;
  }
  db.insert({
    name,
    bio,
    created_at,
    updated_at
  })
  .then(user => {
    res.status(201).json({success: true, user })
  })
  .catch(err => {
    res.status(500).json({success: false, message: err.message})
  });
});


//Post to Delete
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(res => {
      if (res === 0) {
        res.status(404).json({
          success:false,
          message: "The user with the specified ID does not exist."
        })
      } 
      res.status(204).json({ success: `User with id: ${id} removed from system`})
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The user could not be removed"
      })
    })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    sendUserError(400, 'Must provide name and bio', res);
    return;
  }
  db
    .update(id, { name, bio })
    .then(response => {
      if (response == 0) {
        sendUserError(
          404,
          'The user with the specified ID does not exist.',
          res
        );
        return;
      }
      db
        .findById(id)
        .then(user => {
          if (user.length === 0) {
            sendUserError(404, 'User with that id not found', res);
            return;
          }
          res.json(user);
        })
        .catch(error => {
          sendUserError(500, 'Error looking up user', res);
        });
    })
    .catch(error => {
      sendUserError(500, 'Something bad happened in the database', res);
      return;
    });
});

