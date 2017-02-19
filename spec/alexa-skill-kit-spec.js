/* global describe, it, expect */
'use strict'

const underTest = require('../lib')

describe('Alexa Skill Kit', () => {
  it('should export a function', () => {
    expect(typeof underTest).toBe('function')
  })
})
