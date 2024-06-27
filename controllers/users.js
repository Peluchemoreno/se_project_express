const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../utils/config");

const {
  castOrValidationError,
  documentNotFoundError,
  defaultError,
  // invalidEmailError,
  unauthorizedError,
} = require("../utils/errors");

const DuplicateEmailError = require('../errors/duplicateEmailError')
const ValidationError = require('../errors/validationError')

const User = require("../models/user");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {

      if (!email) {
        return next(new ValidationError("The data is invalid"));
      }

      if (user) {
        return next(new DuplicateEmailError('Please use a different email'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({ name, avatar, email, password: hash })
  ).then((user) => {
      console.log(`${password} is the password HEREEEE`)
      res.send({
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      console.error(err)
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

const login = (req, res) => {
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
      console.log(err)
      if (err.name === "ValidationError"){
        res.status(castOrValidationError).send({message: "Invalid data"})
      }
      res.status(unauthorizedError).send({ message: "Not authorized" });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.params;
  User.findByIdAndUpdate(
    userId,
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
      } else {
        res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
