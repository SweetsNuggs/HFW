const Event = require('../../Tools/Structures/Event')

class Error extends Event {
    constructor(...args){
        super(...args, {
            diranme: __dirname,
        });
    }
    async run(client, error){
        client.logger.error(error)
        const channel = client.channels.cache.get('1024416485982089306')
        return channel.send({content: `${error}`})
    }
}

module.exports = Error