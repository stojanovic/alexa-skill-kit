# Alexa Skill Kit

[![](https://travis-ci.org/stojanovic/alexa-skill-kit.svg?branch=master)](https://travis-ci.org/stojanovic/alexa-skill-kit)
[![npm](https://img.shields.io/npm/v/alexa-skill-kit.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/alexa-skill-kit)
[![npm](https://img.shields.io/npm/l/alexa-skill-kit.svg?maxAge=2592000?style=plastic)](https://github.com/stojanovic/alexa-skill-kit/blob/master/LICENSE)

Library for effortless Alexa Skill development with AWS Lambda.

<h1 align="center">
  <img width="150" src="alexa-skill-kit.png" alt="Alexa Skill Kit">
  <br>
</h1>

In this documentation:

- [Installation guide](#installation)
- [Usage](#usage)
  - [Replying with a simple text](#replying-with-a-simple-text)
  - [Replying with an object](#replying-with-an-object)
  - [More complex replies](#more-complex-replies)
  - [Async replies](#async-replies)
- [API reference](#api-reference)
- [How to contribute](#contribute)
- [License](#license)

## Installation

Alexa Skill Kit is available as a Node.js module on NPM. To install it, run the following command in an existing Node.js project:

```shell
npm install alexa-skill-kit --save
```

## Usage

Alexa Skill Kit is a library that simplifies the development of Alexa Skills with Node.js and AWS Lambda. It doesn't require any specific deploy style, it can work with manually created Lambda functions, deployment via [Claudia.js](https://claudiajs.com), etc.

Since I recommend [Claudia.js](https://claudiajs.com) because of it's simplicity all the following examples will use it. You can get it from NPM here: [npmjs.com/package/claudia](https://www.npmjs.com/package/claudia).

After installing the Alexa Skill Kit from NPM, require it in your code:

```javascript
const alexaSkillKit = require('alexa-skill-kit')
```

or with `import`* syntax:

```javascript
import alexaSkillKit from 'alexa-skill-kit'
```

_\* `import` syntax is not supported in Node.js, you need to use additional library like Babel to make it work._

After requiring it, you simply need to pass event and context from Lambda function, beside `event` and `function`, you need to pass a handler function as the last param.

For Example:

```javascript
const alexaSkillKit = require('alexa-skill-kit')

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
    // Do something
  })
}
```

### How to reply

Alexa Skill Kit simplifies replying to Alexa requests. There's a few things you can do:

- [Replying with a simple text](#replying-with-a-simple-text)
- [Replying with an object](#replying-with-an-object)
- [More complex replies](#more-complex-replies)
- [Async replies](#async-replies)

Keep on reading and all of them will be explained bellow.

### Replying with a simple text

If you want Alexa to reply with a simple text you simply need to return the text in a handler function. Alexa Skill Kit will wrap the text in a valid object.

For example:

```javascript
const alexaSkillKit = require('alexa-skill-kit')

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
    return 'Hello'
  })
}
```

An example above will reply to Alexa with the following object:

```json
{
  "version": "1.0",
  "response": {
    "shouldEndSession": true,
    "outputSpeech": {
      "type": "PlainText",
      "text": "Hello"
    }
  }
}
```

As you can see, session will be closed by default. To keep the session opened or to answer with more complex request you can send an object instead of the text.

### Replying with an object

If you want to keep the session opened or you want to return something more than a simple output speech you can send an object and Alexa Skill Kit will not modify it.

For example:

```javascript
const alexaSkillKit = require('alexa-skill-kit')

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
    return {
      version: '1.0',
      response: {
        shouldEndSession: false,
        outputSpeech: {
          type: 'PlainText',
          text: 'Hello'
        },
        card: {
          type: 'Simple',
          title: 'Simple Card',
          content: 'An example for a simple card reply'
        }
      }
    }
  })
}
```

### More complex replies

Building objects manually is hard and boring. I recommend using [Alexa Message Builder](https://github.com/stojanovic/alexa-message-builder) module to simplify building more complex replies.

[Alexa Message Builder](https://github.com/stojanovic/alexa-message-builder) is available [on NPM](https://www.npmjs.com/package/alexa-message-builder), and you can add it to your project with following command:

```shell
npm install alexa-message-builder --save
```

After that simply require it with Alexa Skill Kit like this:

```javascript
const alexaSkillKit = require('alexa-skill-kit')
const AlexaMessageBuilder = require('alexa-message-builder')

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
    return new AlexaMessageBuilder()
      .addText('Hello')
      .addSimpleCard('Simple Card', 'An example for a simple card reply')
      .keepSession()
      .get()
  })
}
```

An example above is the same as the example from ["Replying with an object"](#replying-with-an-object) section.

**Why Alexa Message Builder is not the part of Alexa Skill Kit?**

Well, without a real reason, Alexa Message Builder was developed before Alexa Skill Kit, and they are separate modules in case anyone needs just one of them without the other.

### Async replies

Alexa Skill Kit uses promises to handle async replies. To be able to reply asynchronously simply return the promise and resolve it with a text or an object and Alexa Skill Kit will apply the same rules as above.

For example:

```javascript
const alexaSkillKit = require('alexa-skill-kit')

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
    return fetchSomethingFromTheServer()
      .then(result => doSomethingWithTheResult(result))
      .then(processedResult => {
        return `Here's an info from the server: ${processedResult}`
      })
  })
}
```

Alexa Skill Kit will answer with the text:

```javascript
`Here's an info from the server: ${processedResult}`
```

## API reference

**Alexa Skill Kit** (`function`) receives following attributes:

- Event (`object`, required) — an unmodified object received from Amazon Alexa. If your Lambda function receives an object that is not valid Amazon Alexa request it will not parse it and your handler function will never be called.
- Context (`object`, required) — a context object received on AWS Lambda, it is recommended not to modify it, but Alexa Skill Kit will use `context.succeed` and `context.fail` functions only, so you can pass a custom object that contains those two functions from and original context object.
- Handler (`function`, required) — a function that receives parsed event and returns a reply that will be passed to Amazon Alexa.

**Handler function** is a function that receives parsed event and can return string, object or a promise that will return string or object when it is resolved.

In case you don't want Alexa to reply simply return `null` or don't return at all.

**Parsed object** is an object that contains following properties:

- type (_string_) - type of the request, it can be 'LaunchRequest', 'IntentRequest', 'SessionEndedRequest', or one of the 'AudioPlayer' or 'PlaybackController' requests
- request (_object_) - full request object from Alexa request
- intent: (_object_, can be _null_) - intent object from Alexa request, if the request does not contain intent, this property will be `null`
- session: (_object_, can be _null_) - session object from Alexa request, if session doesn't exists in the request, this property will be `null`
- sessionAttributes: (_object_) - an object with session attributes from Alexa request, if they does not exist, this property will be an empty object (`{}`)
- user: (_object_) - user object from Alexa request, Alexa Skill Kit will try to load user from the context, then from the session and finally, it'll set an empty object if user info is not found
- originalRequest: (_object_) - full Alexa request, as received from AWS Lambda and as described in an [official documentation](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#request-format).

## Contribute

### Folder structure

The main body of code is in the [lib](lib) directory.

The tests are in the [spec](spec) directory, and should follow the structure of the corresponding source files. All executable test file names should end with `-spec`, so they will be automatically picked up by `npm test`. Any additional project files, helper classes etc that must not be directly executed by the test runner should not end with `-spec`. You can use the [spec/helpers](spec/helpers) directory to store Jasmine helpers, that will be loaded before any test is executed.

### Running tests

We use [Jasmine](https://jasmine.github.io/) for unit and integration tests. Unless there is a very compelling reason to use something different, please continue using Jasmine for tests. The existing tests are in the [spec](spec) folder. Here are some useful command shortcuts:

Run all the tests:

```bash
npm test
```

Run only some tests:

```bash
npm test -- filter=prefix
```

Get detailed hierarchical test name reporting:

```bash
npm test -- full
```

We use [ESLint](http://eslint.org/) for syntax consistency, and the linting rules are included in this repository. Running `npm test` will check the linting rules as well. Please make sure your code has no linting errors before submitting a pull request.

## License

MIT - See [LICENSE](LICENSE)
