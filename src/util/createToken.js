const jwt = require('jsonwebtoken')
const nowsday = require('./intDate')
const { secret_key, sk_time_life} = require('./../config')

module.exports = async (user) => {
  let payload = {
    user: user,
    info: 'token is valid'
  }

  let token = jwt.sign(payload, secret_key, {
    expiresIn: sk_time_life
  })

  return {
    token: token,
    expires_in: nowsday + sk_time_life
  }
}