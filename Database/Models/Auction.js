const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Auction = new Schema({
    guild: {type: String},
    id: {type: String},
    currency: {type: Number, default: 0},
    currentbid: {type: Number, default: 0}
})

module.exports = mongoose.model(`Auction`, Auction)