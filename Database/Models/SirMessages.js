const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SirMessage = new Schema({
    id: {type: String}, 
    username: {type: String},
    messageCount: {type: Number, default: 0},
    totalMessageCount: {type: Number, default: 0},
    messages: [
        {
            content: {type: String},
            date: {type: String, default: new Date()},
            channel: {type: String}
        }
    ]
       
})

module.exports = mongoose.model('SirMessages', SirMessage)