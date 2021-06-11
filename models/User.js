const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    first: { type: String, required: true },
    last:  { type: String, required: true },
    email:     { type: String, required: true },
    password:  { type: String, required: true },
    phone:     { type: String, required: true },
    birthday:  { type: Date,   required: true },
    friends:   { type: Schema.Types.ObjectId, ref: 'Users', required: false }
})

module.exports = mongoose.model('Users', UserSchema)