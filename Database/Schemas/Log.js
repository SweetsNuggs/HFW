const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
    commandName: {type: String, default: 'unknown'},
    date: {type: Number, default: Date.now()},
    author: {type: Object, default: {
        username: 'unknown',
        discriminator: '0000',
        id: null
    }},
    guild: {type: Object, default: {
        name: 'unknown',
        channel: null, 
        id: null
    }}
})

module.exports = mongoose.model("Log", LogSchema)