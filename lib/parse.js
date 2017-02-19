'use strict'

module.exports = function parse(message) {
  return new Promise((resolve, reject) => {
    if (typeof message !== 'object' || !message || !message.request || (['LaunchRequest', 'IntentRequest', 'SessionEndedRequest'].indexOf(message.request.type) < 0) && !/^AudioPlayer\./.test(message.request.type) && !/^PlaybackController\./.test(message.request.type)) {
      reject({
        error: 'Not valid Alexa request',
        description: 'It seems that event is not a valid Alexa request. In case you think this is an issue, please report it at https://github.com/stojanovic/alexa-skill-kit/issues and include debug info from this object.',
        debug: message
      })
    }

    const parsedMessage = {
      type: message.request.type,
      request: message.request,
      intent: message.request.intent || null,
      session: message.session || null,
      sessionAttributes: (message.session && message.session.attributes) || {},
      user: (message.context && message.context.user) || (message.session && message.session.user) || {},
      originalRequest: message
    }

    resolve(parsedMessage)
  })
}
