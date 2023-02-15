const mongoose = require('mongoose')
const config = require('../../config.json')
const Schema = mongoose.Schema

const guildSchema = new Schema({
    id: {type: String},
    name: {type: String},
    membersData: {type: Object, default: {}},
    members: [{type: Schema.Types.ObjectId, ref: "Member"}],
    prefix: {type: String, default: config.prefix},
    confessions: {type: Number, default: 0},
    commands: {type: Array, default: []},
    verifiedSirRolesId: {type: Array, default: null},
    verifiedCuntRolesId: {type: Array, default: null},
    removeRolesId: {type: Array, default: null},
})

module.exports = mongoose.model("Guild", guildSchema);