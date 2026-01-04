const express = require("express");
const router = express.Router();

const {
    getBooks,
    createBook,
    updateBook,
    deleteBook } = require("../controllers/book.controller");
const { protect, admin } = require("../middlewares/auth.middleware")

// General Routes
router.route('/')
    .get(getBooks)
    .post(protect, admin, createBook);

// ID Specific Routes
router.route('/:id')
    .put(protect, admin, updateBook)
    .delete(protect, admin, deleteBook);


module.exports = router;    