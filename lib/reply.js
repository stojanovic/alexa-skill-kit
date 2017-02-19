'use strict'

module.exports = function reply(message) {
  if (typeof message === 'string' && message.trim().length) {
    return {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: {
          type: 'PlainText',
          text: message
        }
      }
    }
  }

  if (typeof message === 'object' && message !== null && !Array.isArray(message))
    return message
}
