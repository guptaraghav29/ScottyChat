// By Gary Chen

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RoomSchema = new Schema({
    name: { type: String, required: true },
    messages: [{
        userName: { type: String },
        message:  { type: String },
        userID:   { type: Schema.Types.ObjectId, required: true },
        date:     { type: Date, default: Date.now() }
    }]
})

module.exports = mongoose.model('Rooms', RoomSchema)