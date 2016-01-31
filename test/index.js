var bunyan = require('bunyan'),
    BunyanMailgun = require('../')

require('should')

describe('BunyanMailgun', function(){
    
    it('should error on fake settings', function(done){
        var bm = new BunyanMailgun({
                to: 'to@example.com',
                from: 'from@example.com',
                key: 'key-XXXXXXXXXXXXXXXXXXXXXXX',
                domain: 'mydomain.mailgun.org'
            }),

            logger = bunyan.createLogger({
                name: 'test',
                streams: [{
                    type: 'raw',
                    level: 'fatal',
                    stream: bm
                }]
            })

        logger.fatal(new Error('Oh noze!'), 'Bad happened') 

        // We are using fake configs so it should just error
        bm.on('error', function (error) {
            error.message.should.equal('Forbidden')
            done()
        })
    })
})