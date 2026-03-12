import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth',
});

export const signup = async (data) => {
  return API.post('/signup', data);
};

export const verifyOtp = async (data) => {
  return API.post('/verify-otp', data);
};

export const login = async (data) => {
  return API.post('/login', data);
};
