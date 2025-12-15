import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './VerifyOTP.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const userId = location.state?.userId;
  const contact = location.state?.contact;
  const demoOtp = location.state?.demoOtp;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOTP(userId, otpString);
      
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.resendOTP(userId);
      
      if (response.success) {
        setSuccess(response.data?.demoOtp 
          ? `OTP sent successfully! Demo OTP: ${response.data.demoOtp}` 
          : 'OTP sent successfully!');
        setResendTimer(20);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-content">
        {/* Left Side - Visual */}
        <div className="otp-left">
          <div className="logo">
            <img src="/images/logo-light.svg" alt="Productr" style={{ height: '32px' }} />
          </div>

          <div className="otp-card-visual">
            <div className="runner-silhouette">
              🏃
            </div>
            <h3>Uplist your<br />product to market</h3>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="otp-right">
          <h2>Login to your Productr Account</h2>
          
          <form onSubmit={handleSubmit} className="otp-form">
            {demoOtp && (
              <div className="demo-otp-banner" style={{
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '16px',
                textAlign: 'center',
                color: '#856404'
              }}>
                <strong>🔓 Demo Mode:</strong> Your OTP is <strong style={{ fontSize: '18px', letterSpacing: '2px' }}>{demoOtp}</strong>
              </div>
            )}
            
            <div className="form-group">
              <label>Enter OTP</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="otp-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Enter your OTP'}
            </button>

            <div className="resend-otp">
              Didn't receive OTP?
              {canResend ? (
                <button 
                  type="button" 
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend
                </button>
              ) : (
                <span className="resend-timer"> Resend in {resendTimer}s</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
