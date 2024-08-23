const jwt = require('jsonwebtoken')

const JWT_SECRET = require('../utils/config');
const unauthorizedError = require('../errors/unauthorizedError')

console.log(unauthorizedError)

function authorize(req, res, next){
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")){
    // return res.status(unauthorizedError).send({message: 'Authorization required'})
    return unauthorizedError(next)
  }

  const token = authorization.replace("Bearer ", '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    // return res.status(unauthorizedError).send({message: 'Authorization required'})
    return unauthorizedError(next)
  }

  req.user = payload;
  return next();
}

module.exports = authorize;
