const {
  castOrValidationError,
  documentNotFoundError,
  defaultError,
} = require("../utils/errors");

const User = require("../models/user");

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(castOrValidationError)
          .send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res
          .status(castOrValidationError)
          .send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(documentNotFoundError).send({ message: err.message });
      } else {
        res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(castOrValidationError).send({ message: "Invalid data" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(documentNotFoundError).send({ message: err.message });
      } else {
        res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
