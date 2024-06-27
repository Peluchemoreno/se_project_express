const jwt = require('jsonwebtoken')

const {JWT_SECRET} = require('../utils/config');
const { unauthorizedError } = require('../utils/errors');

let payload;

const authorize = (req, res, next) => {
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")){
    return res.status(unauthorizedError).send({message: 'Authorization required'})
  }

  const token = authorization.replace("Bearer ", '');

  payload = jwt.verify(token, JWT_SECRET)

  req.user = payload;
  return next();
}

module.exports = authorize;
