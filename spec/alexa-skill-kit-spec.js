/* global describe, it, expect, spyOn */
'use strict'

const underTest = require('../lib')

describe('Alexa Skill Kit', () => {
  it('should export a function', () => {
    expect(typeof underTest).toBe('function')
  })

  it('should return a promise', () => {
    expect(typeof underTest({}, { succeed: () => {}, fail: () => {}}, () => {})).toBe('object')
    expect(typeof underTest({}, { succeed: () => {}, fail: () => {}}, () => {}).then).toBe('function')
    expect(typeof underTest({}, { succeed: () => {}, fail: () => {}}, () => {}).catch).toBe('function')
  })

  it('should throw an error if message is not provided or not an object', () => {
    expect(() => {underTest()}).toThrowError('Message is required for Alexa Skill Kit.')
    expect(() => {underTest('abc')}).toThrowError('Message is required for Alexa Skill Kit.')
    expect(() => {underTest(123)}).toThrowError('Message is required for Alexa Skill Kit.')
  })

  it('should throw an error if context is not provided or not an object that contains succeed and fail functions', () => {
    expect(() => {underTest({})}).toThrowError('Context is required for Alexa Skill Kit.')
    expect(() => {underTest({}, 'abc')}).toThrowError('Context is required for Alexa Skill Kit.')
    expect(() => {underTest({}, { a: 1 })}).toThrowError('Context is required for Alexa Skill Kit.')
  })

  it('should throw an error if handler is not provided or not a function', () => {
    expect(() => {underTest({}, { succeed: () => {}, fail: () => {}})}).toThrowError('Handler is required for Alexa Skill Kit.')
    expect(() => {underTest({}, { succeed: () => {}, fail: () => {}}, 'abc')}).toThrowError('Handler is required for Alexa Skill Kit.')
    expect(() => {underTest({}, { succeed: () => {}, fail: () => {}}, {})}).toThrowError('Handler is required for Alexa Skill Kit.')
  })

  it('should invoke context.fail function if message can not be parsed', done => {
    underTest({}, {
      succeed: done.fail,
      fail: done
    }, Promise.resolve)
  })

  it('should invoke context.fail function if handler promise is rejected', done => {
    underTest({}, {
      succeed: done.fail,
      fail: done
    }, Promise.reject)
  })

  it('should not invoke context.succeed or context.fail if reply is invoked with anything but object or string', done => {
    const context = {
      succeed: () => {},
      fail: () => {}
    }
    spyOn(context, 'succeed')
    spyOn(context, 'fail')
    underTest({ request: { type: 'LaunchRequest' } }, context, () => Promise.resolve(123))
    setTimeout(() => {
      expect(context.succeed).toHaveBeenCalledWith(undefined)
      expect(context.fail).not.toHaveBeenCalled()
      done()
    }, 100)
  })

  it('should invoke context.succeed for a valid Alexa LaunchRequest and reply with simple text', done => {
    const launchRequest = {
      version: '1.0',
      session: {
        new: true,
        sessionId: 'amzn1.echo-api.session.0000000-0000-0000-0000-00000000000',
        application: {
          applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
        },
        attributes: {},
        user: {
          userId: 'amzn1.account.AM3B00000000000000000000000'
        }
      },
      context: {
        System: {
          application: {
            applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
          },
          user: {
            userId: 'amzn1.account.AM3B00000000000000000000000'
          },
          device: {
            supportedInterfaces: {
              AudioPlayer: {}
            }
          }
        },
        AudioPlayer: {
          offsetInMilliseconds: 0,
          playerActivity: 'IDLE'
        }
      },
      request: {
        type: 'LaunchRequest',
        requestId: 'amzn1.echo-api.request.0000000-0000-0000-0000-00000000000',
        timestamp: '2015-05-13T12:34:56Z',
        locale: 'string'
      }
    }
    const context = {
      succeed: result => {
        expect(result).toEqual({
          version: '1.0',
          response: {
            shouldEndSession: true,
            outputSpeech: {
              type: 'PlainText',
              text: 'Hello'
            }
          }
        })
        done()
      },
      fail: () => {}
    }
    underTest(launchRequest, context, () => Promise.resolve('Hello'))
  })

  it('should invoke context.succeed for a valid Alexa LaunchRequest and reply with an object', done => {
    const launchRequest = {
      version: '1.0',
      session: {
        new: true,
        sessionId: 'amzn1.echo-api.session.0000000-0000-0000-0000-00000000000',
        application: {
          applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
        },
        attributes: {},
        user: {
          userId: 'amzn1.account.AM3B00000000000000000000000'
        }
      },
      context: {
        System: {
          application: {
            applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
          },
          user: {
            userId: 'amzn1.account.AM3B00000000000000000000000'
          },
          device: {
            supportedInterfaces: {
              AudioPlayer: {}
            }
          }
        },
        AudioPlayer: {
          offsetInMilliseconds: 0,
          playerActivity: 'IDLE'
        }
      },
      request: {
        type: 'LaunchRequest',
        requestId: 'amzn1.echo-api.request.0000000-0000-0000-0000-00000000000',
        timestamp: '2015-05-13T12:34:56Z',
        locale: 'string'
      }
    }
    const replyObject = {
      version: '1.0',
      response: {
        shouldEndSession: false,
        outputSpeech: {
          type: 'PlainText',
          text: 'Hello from object'
        }
      }
    }
    const context = {
      succeed: result => {
        expect(result).toEqual(replyObject)
        done()
      },
      fail: () => {}
    }
    underTest(launchRequest, context, () => Promise.resolve(replyObject))
  })

  it('should invoke context.succeed for a valid Alexa LaunchRequest when request is streamed to response', done => {
    const launchRequest = {
      version: '1.0',
      session: {
        new: true,
        sessionId: 'amzn1.echo-api.session.0000000-0000-0000-0000-00000000000',
        application: {
          applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
        },
        attributes: {},
        user: {
          userId: 'amzn1.account.AM3B00000000000000000000000'
        }
      },
      context: {
        System: {
          application: {
            applicationId: 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
          },
          user: {
            userId: 'amzn1.account.AM3B00000000000000000000000'
          },
          device: {
            supportedInterfaces: {
              AudioPlayer: {}
            }
          }
        },
        AudioPlayer: {
          offsetInMilliseconds: 0,
          playerActivity: 'IDLE'
        }
      },
      request: {
        type: 'LaunchRequest',
        requestId: 'amzn1.echo-api.request.0000000-0000-0000-0000-00000000000',
        timestamp: '2015-05-13T12:34:56Z',
        locale: 'string'
      }
    }
    const context = {
      succeed: result => {
        expect(result).toEqual({
          type: 'LaunchRequest',
          request: launchRequest.request,
          intent: null,
          session: launchRequest.session,
          sessionAttributes: {},
          user: {
            userId: 'amzn1.account.AM3B00000000000000000000000'
          },
          originalRequest: launchRequest
        })
        done()
      },
      fail: () => {}
    }
    underTest(launchRequest, context, parsedMessage => Promise.resolve(parsedMessage))
  })



  it('should invoke context.succeed for a valid Alexa IntentRequest when request is streamed to response', done => {
    const intentRequest = {
      'version': '1.0',
      'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.0000000-0000-0000-0000-00000000000',
        'application': {
          'applicationId': 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
        },
        'attributes': {
          'supportedHoroscopePeriods': {
            'daily': true,
            'weekly': false,
            'monthly': false
          }
        },
        'user': {
          'userId': 'amzn1.account.AM3B00000000000000000000000'
        }
      },
      'context': {
        'System': {
          'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
          },
          'user': {
            'userId': 'amzn1.account.AM3B00000000000000000000000'
          },
          'device': {
            'supportedInterfaces': {
              'AudioPlayer': {}
            }
          }
        },
        'AudioPlayer': {
          'offsetInMilliseconds': 0,
          'playerActivity': 'IDLE'
        }
      },
      'request': {
        'type': 'IntentRequest',
        'requestId': ' amzn1.echo-api.request.0000000-0000-0000-0000-00000000000',
        'timestamp': '2015-05-13T12:34:56Z',
        'locale': 'string',
        'intent': {
          'name': 'GetZodiacHoroscopeIntent',
          'slots': {
            'ZodiacSign': {
              'name': 'ZodiacSign',
              'value': 'virgo'
            }
          }
        }
      }
    }
    const context = {
      succeed: result => {
        expect(result).toEqual({
          type: 'IntentRequest',
          request: intentRequest.request,
          intent: intentRequest.request.intent,
          session: intentRequest.session,
          sessionAttributes: {
            supportedHoroscopePeriods: {
              daily: true,
              weekly: false,
              monthly: false
            }
          },
          user: {
            userId: 'amzn1.account.AM3B00000000000000000000000'
          },
          originalRequest: intentRequest
        })
        done()
      },
      fail: () => {}
    }
    underTest(intentRequest, context, parsedMessage => Promise.resolve(parsedMessage))
  })
})
