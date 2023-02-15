const moment = require('moment')

exports.log = (content, type = 'log') => {
    const timestamp = `[${moment().format("DD-MM-YY H:m:s")}]`;
    switch (type) {
        case "log": {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`);
        }
        case 'warn': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        case 'debug': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        case 'error': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        case 'cmd': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        case 'ready': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        case 'load': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        case 'event': {
            return console.log(`${timestamp} ${(type.toUpperCase())} ${content}`)
        }
        default: throw new TypeError(`Wrong type of logging buddy`)
    }
};

exports.error = (...args) => this.log(...args, 'error');
exports.warn = (...args) => this.log(...args, 'warn');
exports.cmd = (...args) => this.log(...args, 'cmd');
exports.ready = (...args) => this.log(...args, 'ready');
exports.load = (...args) => this.log(...args, 'load');
exports.event = (...args) => this.log(...args, 'event');
exports.debug = (...args) => this.log(...args, 'debug');