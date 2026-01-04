const asyncHandler = require("express-async-handler");
const Book = require("../models/book.models");


// @desc    Get all Books (with Pagination)
// @route   GET /api/Books?page=1&limit=10
// @access  Public 
const getBooks = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const total = await Book.countDocuments();

    res.status(200).json({
        success: true,
        count: books.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: books
    });
});


// @desc    Create a new Book
// @route   POST /api/Books
// @access  Private
const createBook = asyncHandler(async (req, res) => {

    if (!req.body.title || !req.body.author) {
        res.status(400);
        throw new Error("Please provide title and author");
    }

    const newBook = await Book.create(req.body);

    res.status(201).json({
        success: true,
        data: newBook
    })
});

// @desc    Update a Book
// @route   PUT /api/Books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error("Book not found");
    }

    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        });

    res.status(200).json({
        success: true,
        data: updatedBook
    });
});

// @desc    Delete a Book
// @route   DELETE /api/Books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error("Book not found");
    }

    await book.deleteOne();

    res.status(200).json({
        success: true,
        message: "Book removed successfully"
    });
});


module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook
};