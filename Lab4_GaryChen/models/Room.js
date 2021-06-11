// By Gary Chen

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RoomSchema = new Schema({
    name: { type: String, required: true },
    messages: [{
<<<<<<< HEAD
        userName: { type: String },
        message: { type: String },
        date: { type: Date, 
                default: Date.now() }
=======
        username: { 
                    first: { type: String, required: true },
                    last:  { type: String, required: true } },
        message:  { type: String },
        userID:   { type: Schema.Types.ObjectId, 
                    required: true, 
                    ref: 'Users' },
        date:     { type: Date, default: Date.now() }
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
    }]
})

module.exports = mongoose.model('Rooms', RoomSchema)