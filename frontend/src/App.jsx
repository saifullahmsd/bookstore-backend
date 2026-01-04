import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import bookService from './services/bookService';
import authService from './services/authService';
import BookForm from './components/BookForm';
import Login from './components/Login';

function App() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Session Check (On Load)
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await authService.checkSession();
        setUser(userData);
      } catch (error) {
        console.log("Session expired or guest mode");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  // 2. Fetch Books (Always available)
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.fetchBooks(); // Expects {data: [], ...}
      setBooks(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📚 Kitaab Ghar</h1>
        {user ? (
          <div>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>👤 {user.name}</span>
            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}>Logout</button>
          </div>
        ) : (
          <div style={{ gap: '10px', display: 'flex' }}>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        )}
      </header>
      <hr />

      <Routes>
        <Route path="/" element={
          <>
            {user && user.isAdmin && (
              <div style={{ marginBottom: '20px' }}>
                <h3>Add New Book</h3>
                <BookForm onAdd={(newBook) => setBooks([...books, newBook])} />
              </div>
            )}

            <h2>Available Books: {books.length}</h2>
            <ul>
              {books.map((book) => (
                <li key={book._id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
                  <strong>{book.title}</strong> - ${book.price} <br />
                  <small>by {book.author}</small>
                </li>
              ))}
            </ul>
          </>
        } />

        <Route path="/login" element={
          !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
        } />
      </Routes>

    </div>
  );
}

export default App;