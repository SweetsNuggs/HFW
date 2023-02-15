const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MaleSir = new Schema({
    guildId: {type: String},
    members: [{
        id: {type: String},
        username: {type: String},
        dateAdded: {type: String, default: Date.now()}
    }]
})

module.exports = mongoose.model('MaleToSir', MaleSir)