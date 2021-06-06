const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passcode: {
        type: String,
        required: true
    },
    joined: {
        type: Date,
        default: Date.now
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        }
    ],
    quantity: [
        {
            type: Number,
            required: true
        }
    ],
    contact: {
        type: Number
    },
    address: {
        type: String
    },
    pincode: {
        type: Number
    },
    photo: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/ehvenga/image/upload/v1622945387/mybooks/display-1_gaotaz.png"
    },
})

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel