const {
  castError,
  documentNotFoundError,
  validationError,
  defaultError,
} = require("../utils/errors");

const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(documentNotFoundError).send({ message: err.message });
      } else {
        res
          .status(defaultError)
          .send({ message: err.message || "internal server error" });
      }
    });
};

const getItem = (req, res) => {

  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(documentNotFoundError).send({ message: err.message });
      }
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(validationError).send({ message: err.message });
        return;
      }
      if (err.name === "CastError") {
        res.status(castError).send({ message: err.message });
        return;
      }
      res
        .status(defaultError)
        .send({ message: err.message || "internal server error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ message: `deleted item with ID: ${item._id}` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(castError).send({ message: "bad request" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(documentNotFoundError)
          .send({ message: "Requested resource not found" });
      } else {
        res.status(defaultError).send({ message: err.message });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;
  ClothingItem.findByIdAndUpdate(itemId, {
    $addToSet: {likes: user}
  },{
    new: true,
  })
  .orFail()
  .then(item => {
    res.status(200).send({data: item})
  }).catch(err => {
    if (err.name === "CastError"){
      return res.status(castError).send({message: err.message})
    }
    if (err.name === "DocumentNotFoundError"){
      return res.status(documentNotFoundError).send({message: "Requested resource not found"})
    }
    return res.status(defaultError).send({message: err.message || "internal server error"})
  })
}

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;
  ClothingItem.findByIdAndUpdate(itemId, {
    $pull: {likes: user}
  },{
    new: true,
  })
  .orFail()
  .then(() => {
    res.status(200).send({message: `deleted item with ID: ${itemId}`})
  }).catch(err => {
    if (err.name === "CastError"){
      return res.status(castError).send({message: err.message})
    }
    if (err.name === "DocumentNotFoundError"){
      return res.status(documentNotFoundError).send({message: "Requested resource not found"})
    }
    return res.status(defaultError).send({message: err.message || "internal server error"})
  })
}

module.exports = { getItems, getItem, createItem, deleteItem, likeItem, dislikeItem };
