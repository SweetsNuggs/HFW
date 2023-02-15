const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountingSchema = new Schema({
    guildId: {type: String},
    channelId: {type: String},
    failChannelId: {type: String},
    currentNumber: {type: Number},
    counterId: {type: String}
})

module.exports = mongoose.model('Counting', CountingSchema)