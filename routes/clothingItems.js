const router = require('express').Router();
const {getItems, getItem, createItem, deleteItem, likeItem, dislikeItem} = require('../controllers/clothingItems');
const authorize = require('../middlewares/auth')

router.get('/', getItems);

router.get('/:itemId', authorize, getItem);

router.post('/', authorize, createItem);

router.delete('/:itemId', authorize, deleteItem)

router.put('/:itemId/likes', authorize, likeItem)

router.delete('/:itemId/likes', authorize, dislikeItem)

module.exports = router;

