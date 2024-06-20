const router = require('express').Router();
const {getItems, getItem, createItem} = require('../controllers/clothingItems');

router.post('/', createItem);

router.get('/', getItems);

router.get('/:itemId', getItem);


module.exports = router;

