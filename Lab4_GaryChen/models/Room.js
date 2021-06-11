// By Gary Chen

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RoomSchema = new Schema({
    name: { type: String, required: true },
    messages: [{
        username: { 
                    first: { type: String, required: true },
                    last:  { type: String, required: true } },
        message:  { type: String },
        userID:   { type: Schema.Types.ObjectId, 
                    required: true, 
                    ref: 'Users' },
        date:     { type: Date, default: Date.now() }
    }]
})

module.exports = mongoose.model('Rooms', RoomSchema)