const {
  castOrValidationError,
  documentNotFoundError,
  defaultError,
  forbiddenError
} = require("../utils/errors");

const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch(() => {
        res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });

    });
};

const getItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(documentNotFoundError).send({ message: err.message });
      }
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
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
        res.status(castOrValidationError).send({ message: "Invalid data" });
        return;
      }
      if (err.name === "CastError") {
        res.status(castOrValidationError).send({ message: "Invalid data" });
        return;
      }
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
  .orFail()
  .then(clothingItem => {
    const ownerId = clothingItem?.owner.toString();


    if (!(currentUserId === ownerId)){
      return res.status(forbiddenError).send({message: "You don't own this item"})
    }

    return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      res.send({ message: `deleted item with ID: ${item._id}` });
    })
  })
  .catch((err) => {
    if (err.name === "CastError") {
      return res.status(castOrValidationError).send({ message: "Invalid data" });
    }
    if (err.name === "DocumentNotFoundError") {
     return res
        .status(documentNotFoundError)
        .send({ message: "Requested resource not found" });
    }
    return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });

  });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;
  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: user },
    },
    {
      new: true,
    }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(castOrValidationError)
          .send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;
  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $pull: { likes: user },
    },
    {
      new: true,
    }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(castOrValidationError)
          .send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
