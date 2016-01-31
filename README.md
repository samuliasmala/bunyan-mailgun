bunyan-mailgun
====================

A Bunyan stream for emailing logs using the Mailgun api.

## Install

```
npm install bunyan-mailgun
```

## Emails

By default BunyanMailgun will create a dynamic email including the subject and email body derived from the bunyan log.

## Example

```
var Bunyan = require('bunyan'),
    BunyanMailgun = require('bunyan-mailgun')

var logger = Bunyan.createLogger({
    name: 'test',
    streams: [{
        type: 'raw',
        level: 'fatal',
        stream: new BunyanMailgun({
            to: 'to@example.com',
            from: 'from@example.com',
            key: 'key-XXXXXXXXXXXXXXXXXXXXXXX', // Mailgun API key
            domain: 'mydomain.mailgun.org'      // Your Mailgun Domain
        })
    }]
})

logger.fatal(new Error('Oh noze!'), 'Bad happened')

```
## Test

```
npm test
```

## Damage and Liability

BunyanMailgun was essentially created for fatal level logs.
Any other levels would eat up your Mailgun account message allotment. 

The author or contributors of this software are NOT IN ANYWAY responsible for
any charges or damages made by sending emails through the Mailgun service.
In otherwords only send fatals. And watch them closely.