// frontend/src/components/Login.jsx
import { useState } from 'react';
import authService from '../services/authService';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Purana error saaf karo

        try {
            const userData = await authService.login({ email, password });
            alert(`Welcome back, ${userData.name}!`);
            onLogin(userData); // Parent ko batao ke login ho gaya
        } catch (err) {
            // Backend se jo error message aaye wo dikhao, warna generic message
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : "Login failed";
            setError(message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>🔐 Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Enter your email"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Enter password"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;