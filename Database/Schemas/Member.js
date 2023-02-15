const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memberSchema = new Schema({
    id: {type: String},
    guildId: {type: String},
    registeredAt: {type: Number, default: Date.now()}
})

module.exports = mongoose.model("Members", memberSchema)