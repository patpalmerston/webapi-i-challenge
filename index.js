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
    .then(res => {
      res.status(201).json(res)
    })
    .catch(err => {
      console.log(err);
      sendUserError(400, error, res);
      return;
    });
});


// //Post to Delete
// server.delete('/api/users/:id', (req, res) => {
//   const id = req.params.id;

//   db.remove(id)
//     .then(() => {
//       if (id) {
//         res.status(204).end()
//       } else {
//         res.status(404).json({
//           success:false,
//           message: "The user with the specified ID does not exist."
//         })
//       }
//     })
//     .catch(err => {
//       res.status(500).json({
//         success: true,
//         error: "The user could not be removed"
//       })
//     })
// })

// //Post to update
// server.update('/api/users/:id', (req, res) => {
//   const { id } = req.params;
//   const changes = req.body;

//   db.update(id, changes)
//     .then(updated => {
//       if(updated === !id) {
//         res.status(404).json({
//           success: false,
//           message: "The user with the specified ID does not exist."
//         })
//       } else if (!user.name || !user.bio) {
//         res.status(400).json({
//            success: false, 
//            errorMessage: "Please provide name and bio for the user." 
//           })
//       } else {
//         res.status(200).json({ success: true, updated });
//       } 
//     })
//     .catch(({ code, message }) => {
//       res.status(500).json({
//         success: false,
//         error: "The user information could not be modified."
//       })
//     })
// })

