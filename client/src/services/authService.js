import api from './api';

export const authService = {
  // Login with email or phone
  login: async (emailOrPhone) => {
    const response = await api.post('/auth/login', { emailOrPhone });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (userId, otp) => {
    const response = await api.post('/auth/verify-otp', { userId, otp });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Resend OTP
  resendOTP: async (userId) => {
    const response = await api.post('/auth/resend-otp', { userId });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
