import axios from 'axios';

// Create a configured instance of axios
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // IMPORTANT: Allows cookies (HttpOnly) to be sent over CORS
    headers: {
        'Content-Type': 'application/json',
    }
});

console.log(import.meta.env.VITE_API_URL);
export default axiosClient;
