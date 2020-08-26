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
        const includeFields = ['name', 'hostname', 'pid', 'time', 'msg', 'err'];
        const excludeFields = ['level', 'v'];
        var rows = [];

        // Include defined fields
        includeFields.forEach(field => {
            if (log[field]) {
                var msg = log[field];
                // Error is a special case when only stack is included
                if (field === 'err') msg = msg.stack;
                rows.push(`* ${field}: ${msg}`);
            }
        });

        // Add rest of the log object after newline (except excluded fields)
        rows.push('');
        Object.keys(log).forEach(field => {
            if (!includeFields.includes(field) && !excludeFields.includes(field)) {
                let val = log[field];
                if (typeof val === "object") val = JSON.stringify(val, null, 2);
                rows.push(`* ${field}: ${val}`);
            }
        });

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