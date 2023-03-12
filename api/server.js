// BUILD YOUR SERVER HERE

const express = require("express");
const server = express();
const User = require("./users/model");

server.use(express.json());

// When the client makes a `GET` request to `/api/users`:

// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The users information could not be retrieved" }`.

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) =>
      res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message,
        stack: err.stack,
      })
    );
});

// When the client makes a `GET` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If there's an error in retrieving the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user information could not be retrieved" }`.

server.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((users) => {
      if (!users) {
        res.status(404).json({
          message: `The user with the specified ID does not exist`,
        });
      } else {
        res.status(200).json(users);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `The user information could not be retrieved`,
      });
    });
});

// When the client makes a `POST` request to `/api/users`:

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_ including its id.

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ message: "There was an error while saving the user to the database" }`.

server.post("/api/users/", async (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  } else {
    User.insert(user)
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
          err: err.message,
        });
      });
  }
});

// When the client makes a `DELETE` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user could not be removed" }`.

server.delete("/api/users/:id", (req, res) => {
  const deletedUser = User.remove(req.params.id);
  deletedUser
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).json({
          message: "The user with the specified ID does not exist",
        });
      } else {
        res.status(200).json(deletedUser);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The user could not be removed",
      });
    });
});

// When the client makes a `PUT` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If there's an error when updating the _user_:

//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user information could not be modified" }`.

// - If the user is found and the new information is valid:

//   - update the user document in the database using the new information sent in the `request body`.
//   - respond with HTTP status code `200` (OK).
//   - return the newly updated _user document_.

server.put("/api/users/:id", (req, res) => {
  const { name, bio } = req.body;
  const updateUser = User.update(req.params.id, { name, bio });
  updateUser
    .then((updateUser) => {
      if (!updateUser) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else if (!name || !bio) {
        res.status(400).json({
          message: "Please provide name and bio for the user",
        });
      } else {
        updateUser;
        res.status(200).json(updateUser);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The user information could not be modified" });
    });
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
