'use strict'

const parse = require('./parse')
const reply = require('./reply')

function alexaSkillKit(message, context, handler) {
  if (typeof message !== 'object')
    throw new Error('Message is required for Alexa Skill Kit.')

  if (typeof context !== 'object' || typeof context.succeed !== 'function' || typeof context.fail !== 'function')
    throw new Error('Context is required for Alexa Skill Kit.')

  if (typeof handler !== 'function')
    throw new Error('Handler is required for Alexa Skill Kit.')

  return parse(message)
    .then(handler)
    .then(reply)
    .then(context.succeed)
    .catch(context.fail)
}

module.exports = alexaSkillKit
