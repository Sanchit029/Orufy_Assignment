const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    // Check if it's email or phone
    const isEmail = emailOrPhone.includes('@');
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    // Find or create user
    let user = await User.findOne(query);

    if (!user) {
      user = await User.create(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // In development, log OTP to console
    // In production, send OTP via SMS/Email service
    console.log(`\n🔐 OTP for ${emailOrPhone}: ${otp}\n`);

    const responseData = {
      userId: user._id,
      contact: isEmail ? user.email : user.phone
    };

    // Include OTP in response when DEMO_MODE is enabled
    if (process.env.DEMO_MODE === 'true') {
      responseData.demoOtp = otp;
      console.log('📱 DEMO MODE: OTP included in response');
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP is expired
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Update user
    user.isVerified = true;
    user.lastLogin = Date.now();
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -otpExpiry');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Log OTP (in production, send via SMS/Email)
    console.log(`\n🔐 New OTP for ${user.email || user.phone}: ${otp}\n`);

    const responseData = {};
    
    // Include OTP in response when DEMO_MODE is enabled
    if (process.env.DEMO_MODE === 'true') {
      responseData.demoOtp = otp;
      console.log('📱 DEMO MODE: OTP included in response');
    }

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      ...(Object.keys(responseData).length > 0 && { data: responseData })
    });
  } catch (error) {
    next(error);
  }
};
