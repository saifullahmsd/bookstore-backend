// frontend/src/services/authService.js
import axiosClient from '../api/axiosClient';

// 1. Register User
const register = async (userData) => {
    const response = await axiosClient.post('/users', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// login user 
const login = async (userData) => {
    const response = await axiosClient.post('/users/login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// logout user 
const logout = async () => {
    try {
        await axiosClient.post('/users/logout');
        localStorage.removeItem('user');
    } catch (error) {
        console.log(`logout failed: ${error}`);
    }
};

// Check Session (New feature)
const checkSession = async () => {
    const response = await axiosClient.get('/users/me'); // Assuming you have/make this endpoint accessible
    return response.data;
}

const authService = {
    register,
    logout,
    login,
    checkSession
};

export default authService;