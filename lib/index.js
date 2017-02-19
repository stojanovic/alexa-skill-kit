'use strict'

const parse = require('./parse')
const reply = require('./reply')

function alexaSkillKit(message, context, handler) {
  parse(message)
    .then(handler)
    .then(reply)
    .then(context.succeed)
    .catch(context.fail)
}

module.exports = alexaSkillKit
