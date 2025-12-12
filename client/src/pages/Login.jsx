import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(emailOrPhone);
      
      if (response.success) {
        // Navigate to OTP page with userId
        navigate('/verify-otp', { 
          state: { 
            userId: response.data.userId, 
            contact: response.data.contact 
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Side - Visual */}
        <div className="login-left">
          {/* Background image includes logo and design */}
        </div>

        {/* Right Side - Form */}
        <div className="login-right">
          <h2>Login to your Productr Account</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="emailOrPhone">Email or Phone number</label>
              <input
                type="text"
                id="emailOrPhone"
                placeholder="Enter email or phone number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Login'}
            </button>
          </form>

          <div className="signup-box">
            <p>Don't have a Productr Account</p>
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              alert('Just enter your email or phone above and click Login! We\'ll create your account automatically when you verify the OTP.'); 
            }}>SignUp Here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
