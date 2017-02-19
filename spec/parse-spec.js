/* global describe, it, expect */
'use strict'

const underTest = require('../lib/parse')

describe('Parse', () => {
  it('should be a function', () => {
    expect(typeof underTest).toBe('function')
  })

  it('should return a promise', () => {
    expect(typeof underTest()).toBe('object')
    expect(typeof underTest().then).toBe('function')
    expect(typeof underTest().catch).toBe('function')
  })

  it('should reject a promise if message is not an object', done => {
    Promise.all(['', 123, null, [], [1, 2, 3]].map(item => {
      return underTest(item)
        .then(() => {
          throw new Error('fail')
        })
        .catch(err => {
          return expect(err).toEqual({
            error: 'Not valid Alexa request',
            description: 'It seems that event is not a valid Alexa request. In case you think this is an issue, please report it at https://github.com/stojanovic/alexa-skill-kit/issues and include debug info from this object.',
            debug: item
          })
        })
    }))
      .then(done)
      .catch(done.fail)
  })

  it('should reject a promise if message is an invalid object', done => {
    Promise.all([
      {},
      {
        a: 1
      },
      {
        request: {}
      },
      {
        request: {
          a: 1
        }
      },
      {
        request: {
          type: 'SomeCustomType'
        }
      }
    ].map(item => {
      return underTest(item)
        .then(() => {
          throw new Error('fail')
        })
        .catch(err => {
          return expect(err).toEqual({
            error: 'Not valid Alexa request',
            description: 'It seems that event is not a valid Alexa request. In case you think this is an issue, please report it at https://github.com/stojanovic/alexa-skill-kit/issues and include debug info from this object.',
            debug: item
          })
        })
    }))
      .then(done)
      .catch(done.fail)
  })

  const standardRequestTypes = ['LaunchRequest', 'IntentRequest', 'SessionEndedRequest']
  standardRequestTypes.forEach(item => {
    it(`should parse the object it request type is ${item}`, done => {
      return underTest({
        request: {
          type: item
        }
      })
        .then(done)
        .catch(done.fail)
    })
  })

  const otherRequestTypes = [
    'AudioPlayer.PlaybackStarted',
    'AudioPlayer.PlaybackFinished',
    'AudioPlayer.PlaybackStopped',
    'AudioPlayer.PlaybackNearlyFinished',
    'AudioPlayer.PlaybackFailed',
    'PlaybackController.NextCommandIssued',
    'PlaybackController.PauseCommandIssued',
    'PlaybackController.PlayCommandIssued',
    'PlaybackController.PreviousCommandIssued'
  ]
  otherRequestTypes.forEach(item => {
    it(`should parse the object it request type is ${item}`, done => {
      return underTest({
        request: {
          type: item
        }
      })
        .then(done)
        .catch(done.fail)
    })
  })

  it('should return parsed object with default values when promise resolves', done => {
    const msg = {
      request: {
        type: 'LaunchRequest'
      }
    }
    underTest(msg)
      .then(parsedObject => {
        expect(parsedObject).toEqual({
          type: 'LaunchRequest',
          request: msg.request,
          originalRequest: msg,
          intent: null,
          session: null,
          sessionAttributes: {},
          user: {}
        })
        done()
      })
      .catch(done.fail)
  })

  it('should return parsed object with session and session attributes if they exists when promise resolves', done => {
    const msg = {
      request: {
        type: 'LaunchRequest'
      },
      session: {
        attributes: {
          a: 1
        }
      }
    }
    underTest(msg)
      .then(parsedObject => {
        expect(parsedObject).toEqual({
          type: 'LaunchRequest',
          request: msg.request,
          originalRequest: msg,
          intent: null,
          session: msg.session,
          sessionAttributes: {
            a: 1
          },
          user: {}
        })
        done()
      })
      .catch(done.fail)
  })

  it('should return parsed object with user if it exists in context when promise resolves', done => {
    const msg = {
      request: {
        type: 'LaunchRequest'
      },
      context: {
        user: {
          id: 123
        }
      }
    }
    underTest(msg)
      .then(parsedObject => {
        expect(parsedObject).toEqual({
          type: 'LaunchRequest',
          request: msg.request,
          originalRequest: msg,
          intent: null,
          session: null,
          sessionAttributes: {},
          user: {
            id: 123
          }
        })
        done()
      })
      .catch(done.fail)
  })

  it('should return parsed object with user if it exists in session when promise resolves', done => {
    const msg = {
      request: {
        type: 'LaunchRequest'
      },
      session: {
        user: {
          id: 123
        }
      }
    }
    underTest(msg)
      .then(parsedObject => {
        expect(parsedObject).toEqual({
          type: 'LaunchRequest',
          request: msg.request,
          originalRequest: msg,
          intent: null,
          session: msg.session,
          sessionAttributes: {},
          user: {
            id: 123
          }
        })
        done()
      })
      .catch(done.fail)
  })

  it('should return parsed object with intent if it exists when promise resolves', done => {
    const msg = {
      request: {
        type: 'LaunchRequest',
        intent: {
          name: 'GetZodiacHoroscopeIntent',
          slots: {
            ZodiacSign: {
              name: 'ZodiacSign',
              value: 'virgo'
            }
          }
        }
      }
    }
    underTest(msg)
      .then(parsedObject => {
        expect(parsedObject).toEqual({
          type: 'LaunchRequest',
          request: msg.request,
          originalRequest: msg,
          intent: msg.request.intent,
          session: null,
          sessionAttributes: {},
          user: {}
        })
        done()
      })
      .catch(done.fail)
  })
})
