const mongoose = require('mongoose')

module.exports = mongoose.model("User", new mongoose.Schema({
    name: {type: String},
    id: {type: String},
    registeredAt: {type: Number, default: Date.now()}
}))