/* global describe, it, expect */
'use strict'

const underTest = require('../lib/reply')

describe('Reply', () => {
  it('should be a function', () => {
    expect(typeof underTest).toBe('function')
  })

  it('should not return anything if message is not a string or an object', () => {
    expect(underTest()).not.toBeDefined()
    expect(underTest(123)).not.toBeDefined()
    expect(underTest(1.2)).not.toBeDefined()
    expect(underTest([])).not.toBeDefined()
    expect(underTest([1, 2])).not.toBeDefined()
  })

  it('should return an object if message is a string', () => {
    expect(underTest('hello')).toEqual({
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: {
          type: 'PlainText',
          text: 'hello'
        }
      }
    })
  })

  it('should not return anything if message is an empty string', () => {
    expect(underTest('')).not.toBeDefined()
  })

  it('should not return anything if message contains just spaces and tabs', () => {
    expect(underTest(' ')).not.toBeDefined()
    expect(underTest('     ')).not.toBeDefined()
    expect(underTest('\t')).not.toBeDefined()
    expect(underTest('\n')).not.toBeDefined()
    expect(underTest(' \t\n')).not.toBeDefined()
  })

  it('should return the object if message is an object and not null', () => {
    expect(underTest({})).toEqual({})
  })

  it('should not return anything if message is null', () => {
    expect(underTest(null)).not.toBeDefined()
  })
})
