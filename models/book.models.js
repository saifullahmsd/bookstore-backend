const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please add a book title"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "please add an author name"]
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true,
        min: [0, "price cannot be negative"]
    },
    category: {
        type: String,
        enum: ["Fiction", "Technology", "History", "Science", "Other"],
        default: "Other"
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;