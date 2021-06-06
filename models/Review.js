const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    reviewTitle: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviewer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    }
})

const ReviewModel = mongoose.model('Review', ReviewSchema)
module.exports = ReviewModel