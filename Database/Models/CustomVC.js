const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VCSchema = new Schema({
    ownerId: {type: String},
    guildId: {type: String},
    channelId: {type: String},
    channelName: {type: Object},
    settings: {type: String, default: null},
    deputies: {type: Array},
    textChannelId: {type: String}
})

module.exports = mongoose.model('CustomVC', VCSchema)