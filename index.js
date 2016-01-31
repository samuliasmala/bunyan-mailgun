'use strict'
const util = require('util'),
    extend = util._extend,
    Stream = require('stream').Writable,
    Mailgun = require('mailgun-js'),
    Levels = {
        10: 'TRACE',
        20: 'DEBUG',
        30: 'INFO',
        40: 'WARN',
        50: 'ERROR',
        60: 'FATAL'
    }

class BunyanMailgun extends Stream {

    constructor(config){
        super()

        this.config = config
        this.mailgun = new Mailgun({
            apiKey: this.config.key,
            domain: this.config.domain
        })
    }

    /**
     * Format Subject
     */
    _formatSubject(log) {
        return util.format(
            '[%s] %s/%s on %s',
            Levels[log.level] || 'LVL' + log.level,
            log.name,
            log.pid,
            log.hostname
        )
    }

    /**
     * Format Body
     */
    _formatBody(log) {
        var rows = [];
        rows.push('* name: ' + log.name);
        rows.push('* hostname: ' + log.hostname);
        rows.push('* pid: ' + log.pid);
        rows.push('* time: ' + log.time);

        if (log.msg) {
            rows.push('* msg: \n' + log.msg);
        }

        if (log.err) {
            rows.push('* err.stack: ' + log.err.stack);
        }

        return rows.join('\n');
    }

    /**
     * Write Stream
     */
    write(log) {

        this.mailgun.messages().send({
            from: this.config.from,
            to: this.config.to,
            subject: this._formatSubject(log),
            text: this._formatBody(log)
        }, (error, body) => {
            if (error) {
                this.emit('error', error)
            }else{
                this.emit('sent', body)
            }
        })
    }

}


module.exports = BunyanMailgun