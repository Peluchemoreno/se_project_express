const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../utils/config");

const {
  castOrValidationError,
  documentNotFoundError,
  defaultError,
  unauthorizedError,
} = require("../utils/errors");

const DuplicateEmailError = require('../errors/duplicateEmailError')
const User = require("../models/user");

function createUser(req, res) {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {

      if (user) {
        throw new DuplicateEmailError('Please use a different email');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({ name, avatar, email, password: hash })
  ).then((user) => {
      res.send({
        email: user.email,
        name: user.name,
        avatar: user.avatar || 'default avatar image',
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(castOrValidationError)
          .send({ message: "Invalid data" });
      }
      if (err.name === "InvalidEmailError"){
        return res.status(err.statusCode).send({message: "Invalid email"})
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password){
    return res.status(castOrValidationError).send({message: "Invalid data"})
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password"){
      return res.status(unauthorizedError).send({ message: "Not authorized" });
      }
      return res.status(defaultError).send({message: 'An error has occurred on the server'})
    });
};

 function getCurrentUser (req, res) {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError"){
        res.status(documentNotFoundError).send({message: "The requested resource does not exist"})
      }
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

function updateUser(req, res) {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { $set: { name, avatar } },
    { runValidators: true, new: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(castOrValidationError).send({ message: "Invalid data" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(documentNotFoundError).send({ message: err.message });
      } else if (err.name === "ValidationError"){
        res.status(castOrValidationError).send({message: "Invalid data"})
      }
      else {
        res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
