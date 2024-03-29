const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {
        type: Number
    },
    fname: {
        type: String
    },
    points: {
        type: Number
    },
    downloaded: {
        type: Number
    },
    blocked: {
        type: Boolean,
        default: false
    },
    adult: {
        type: Boolean,
        default: true
    },
    country: {
        type: Object
    }
}, { timestamps: true, strict: false })

const model = mongoose.model('botUsersModel', userSchema)
module.exports = model