const User = require('../models/user')

const createUser = (req, res) => {
  const {name, avatar} = req.body;
  User.create({name, avatar})
  .then((user)=>{
    res.status(201).send(user)
  })
  .catch((err)=>{
    if (err.name === "ValidationError"){
      return res.status(400).send({message: err.message})
    }
    return res.status(500).send({message: err.message})
  })
}

const getUsers = (req, res) => {
  User.find({})
  .orFail(()=>{
    const error = new Error('there are no users');
    error.statusCode = 404;
    throw error;
  })
  .then((users)=>{
    res.status(200).send({data: users})
  })
  .catch((err)=>{
    if (err.statusCode === 404){
      res.status(404).send({message: err.message})
    } else {
      res.status(500).send({message: err.message || 'internal server error'})
    }
  })
}

const getUser = (req, res) => {
  const {userId} = req.params
  User.findById(userId)
  .orFail()
  .then((user)=>{
    res.status(200).send(user)
  })
  .catch((err)=>{
    if (err.name === "CastError"){
      res.status(400).send({message: "bad request"})
    }
    else if (err.name === "DocumentNotFoundError"){
      res.status(404).send({message: err.message})
    } else {
      res.status(500).send({message: err.message || 'internal server error'})
    }
  })
}



module.exports = {getUsers, getUser, createUser}