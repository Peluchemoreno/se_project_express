const ClothingItem = require('../models/clothingItem')

function getItems(req, res){
  console.log('getting all items')
  ClothingItem.find({})
  .orFail(()=>{
    const error = new Error('there are no items')
    error.statusCode = 404;
    throw error
  })
  .then(items => {
    res.status(200).send({data: items})
  })
  .catch(err => {
    if (err.statusCode === 404){
      res.statusCode(404).send({message: err.message})
    } else {
      res.statusCode(500).send({message: err.message || 'internal server error'})
    }
  })
}

function getItem(req, res){
  console.log('getting item')

  const {itemId} = req.params
  ClothingItem.findById(itemId)
  .orFail(()=>{
    const error = new Error('this item does not exist')
    error.statusCode = 404;
    throw error
  })
  .then(item => {
    res.status(200).send(item)
  })
  .catch(err => {
    console.error(err)
  })
}

function createItem(req, res){
  console.log('creating item')
  const {name, weather, imageUrl} = req.body;

  ClothingItem.create({name, weather, imageUrl, owner: req.user._id})
  .then(item => {
    res.status(201).send(item)
  })
  .catch(err => {
    console.error(err)
    res.status(500).send({error: err.message})
  })
}

module.exports = {getItems, getItem, createItem}