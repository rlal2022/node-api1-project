// BUILD YOUR SERVER HERE

const express = require("express");
const server = express();
const User = require("./users/model");

module.exports = server; // EXPORT YOUR SERVER instead of {}

// When the client makes a `POST` request to `/api/users`:

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

server.get("api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "error cannot find users", err: err.message })
    );
});

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_ including its id.

server.post("api/users", async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res.status(422).json({ message: "enter name and bio" });
    } else {
      const createdUser = await User.create({ name, bio });
      res.status(201).json({
        message: "new user successfully created",
        data: createdUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Error creating new user: ${err.message}`,
    });
  }
});

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ message: "There was an error while saving the user to the database" }`.

// When the client makes a `GET` request to `/api/users`:

// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The users information could not be retrieved" }`.

// When the client makes a `GET` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.
