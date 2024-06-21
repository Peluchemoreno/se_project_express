const router = require('express').Router();
const {getItems, getItem, createItem} = require('../controllers/clothingItems');

router.get('/', (req, res, next) => {
  console.log('GET / request received');
  console.log('Headers:', req.headers);
  getItems(req, res, next);
});

router.get('/:itemId', (req, res, next) => {
  console.log(`GET /${req.params.itemId} request received`);
  console.log('Headers:', req.headers);
  getItem(req, res, next);
});

router.post('/', (req, res, next) => {
  console.log('POST / request received');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  createItem(req, res, next);
});

module.exports = router;

