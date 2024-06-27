const router = require('express').Router();

const {documentNotFoundError} = require('../utils/errors')


const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems')
const {createUser} = require('../controllers/users')
const {login} = require('../controllers/users')
const authorize = require('../middlewares/auth')

router.use('/users', authorize, userRouter)
router.use('/items', clothingItemRouter)
router.post('/signup', createUser)
router.post('/signin', login)

router.use((req, res)=>{
  res.status(documentNotFoundError).send({message: 'Requested resource not found'})
})

module.exports = router;