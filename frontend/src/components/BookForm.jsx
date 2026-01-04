// frontend/src/components/BookForm.jsx
import { useState } from 'react';
import bookService from '../services/bookService';

const BookForm = ({ onAdd }) => {
    // Local State for Form Inputs
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: 'Fiction'
    });

    const { title, author, price, category } = formData;

    // Jab user kuch type kare
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Jab Form Submit ho
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Service ko call kiya
            const newBook = await bookService.createBook({
                title,
                author,
                price: Number(price), // Number mein convert karna zaroori hai
                category
            });

            // 2. Parent (App.jsx) ko bataya ke "Kaam ho gaya, list update karo"
            onAdd(newBook);

            // 3. Form khali kar diya
            setFormData({
                title: '',
                author: '',
                price: '',
                category: 'Fiction'
            });

            alert("Book Added Successfully! 🎉");

        } catch (error) {
            alert("Error adding book. Check console.");
        }
    };

    return (
        <section style={{ marginBottom: '20px', padding: '15px', border: '2px dashed #4CAF50' }}>
            <h3>➕ Add a New Book</h3>
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text" name="title" value={title} onChange={onChange}
                        placeholder="Book Title" required
                        style={{ padding: '8px', marginRight: '10px' }}
                    />
                    <input
                        type="text" name="author" value={author} onChange={onChange}
                        placeholder="Author Name" required
                        style={{ padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="number" name="price" value={price} onChange={onChange}
                        placeholder="Price" required
                        style={{ padding: '8px', marginRight: '10px' }}
                    />
                    <select
                        name="category" value={category} onChange={onChange}
                        style={{ padding: '8px' }}
                    >
                        <option value="Fiction">Fiction</option>
                        <option value="Technology">Technology</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                    </select>
                </div>
                <button
                    type="submit"
                    style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                >
                    Add Book
                </button>
            </form>
        </section>
    );
};

export default BookForm;