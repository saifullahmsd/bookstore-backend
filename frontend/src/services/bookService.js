// frontend/src/services/bookService.js
import axiosClient from '../api/axiosClient';

const fetchBooks = async (page = 1, limit = 10) => {
    try {
        const response = await axiosClient.get(`/books?page=${page}&limit=${limit}`);
        return response.data; // Now returns { success, count, total, page, pages, data }
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};


const createBook = async (bookData) => {
    try {
        const response = await axiosClient.post('/books', bookData);
        return response.data.data;
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
};

const bookService = {
    fetchBooks,
    createBook
};

export default bookService;