const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisePool } = require('../config/database');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

// Generate JWT Access Token (short-lived)
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m'
    });
};

// Generate JWT Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '3d'
    });
};

// Store refresh token in database
const storeRefreshToken = async (userId, refreshToken) => {
    try {
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 3); // 3 days

        await promisePool.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, tokenHash, expiresAt]
        );
        return true;
    } catch (error) {
        console.error('Error storing refresh token:', error);
        return false;
    }
};

// Verify refresh token exists and is not revoked
const verifyRefreshTokenExists = async (refreshToken) => {
    try {
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const [rows] = await promisePool.query(
            'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = FALSE AND expires_at > NOW()',
            [tokenHash]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return null;
    }
};

// Revoke refresh token
const revokeRefreshToken = async (refreshToken) => {
    try {
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await promisePool.query(
            'UPDATE refresh_tokens SET revoked = TRUE, revoked_at = NOW() WHERE token_hash = ?',
            [tokenHash]
        );
        return true;
    } catch (error) {
        console.error('Error revoking refresh token:', error);
        return false;
    }
};

// Generate secure random token
const generateSecureToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { full_name, email, password, phone } = req.body;

        // Note: Input validation is handled by express-validator middleware
        // This function now only handles business logic

        // Check if user already exists
        const [existingUsers] = await promisePool.query(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Generate email verification token
        const verificationToken = generateSecureToken();
        const verificationTokenExpires = new Date();
        verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // 24 hours

        // Create user
        const [result] = await promisePool.query(
            'INSERT INTO users (full_name, email, password_hash, phone, email_verified, email_verification_token, email_verification_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, password_hash, phone || null, false, verificationToken, verificationTokenExpires]
        );

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken, full_name);
        } catch (emailError) {
            // Log error but don't fail registration
            console.error('Failed to send verification email:', emailError);
        }

        // Generate tokens
        const userId = result.insertId;
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        // Store refresh token in database
        await storeRefreshToken(userId, refreshToken);

        // Set refresh token in httpOnly cookie (secure, sameSite)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                user_id: userId,
                full_name,
                email,
                role: 'student',
                email_verified: false
            },
            accessToken
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Note: Input validation is handled by express-validator middleware

        // Check if user exists
        const [users] = await promisePool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if email is verified (optional - you can make this required)
        // For now, we'll allow login but show a warning if not verified
        const emailVerified = user.email_verified || false;

        // Generate tokens
        const accessToken = generateAccessToken(user.user_id);
        const refreshToken = generateRefreshToken(user.user_id);

        // Store refresh token in database
        await storeRefreshToken(user.user_id, refreshToken);

        // Set refresh token in httpOnly cookie (secure, sameSite)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        res.json({
            success: true,
            message: emailVerified ? 'Login successful' : 'Login successful. Please verify your email address.',
            data: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                email_verified: emailVerified
            },
            accessToken
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { full_name, phone } = req.body;
        const userId = req.user.user_id;

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (full_name) {
            updates.push('full_name = ?');
            values.push(full_name);
        }
        if (phone) {
            updates.push('phone = ?');
            values.push(phone);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(userId);

        await promisePool.query(
            `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
            values
        );

        // Get updated user
        const [users] = await promisePool.query(
            'SELECT user_id, full_name, email, phone, role FROM users WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.user_id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Get current user with password
        const [users] = await promisePool.query(
            'SELECT password_hash FROM users WHERE user_id = ?',
            [userId]
        );

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        // Update password
        await promisePool.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [password_hash, userId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify email address
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        // Find user with this token
        const [users] = await promisePool.query(
            'SELECT user_id, email, email_verification_token_expires FROM users WHERE email_verification_token = ?',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        const user = users[0];

        // Check if token is expired
        if (new Date() > new Date(user.email_verification_token_expires)) {
            return res.status(400).json({
                success: false,
                message: 'Verification token has expired. Please request a new verification email.'
            });
        }

        // Check if already verified
        const [currentUser] = await promisePool.query(
            'SELECT email_verified FROM users WHERE user_id = ?',
            [user.user_id]
        );

        if (currentUser[0].email_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Verify email
        await promisePool.query(
            'UPDATE users SET email_verified = TRUE, email_verification_token = NULL, email_verification_token_expires = NULL WHERE user_id = ?',
            [user.user_id]
        );

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerificationEmail = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        // Get user details
        const [users] = await promisePool.query(
            'SELECT user_id, email, full_name, email_verified FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        if (user.email_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = generateSecureToken();
        const verificationTokenExpires = new Date();
        verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

        // Update user with new token
        await promisePool.query(
            'UPDATE users SET email_verification_token = ?, email_verification_token_expires = ? WHERE user_id = ?',
            [verificationToken, verificationTokenExpires, userId]
        );

        // Send verification email
        try {
            await sendVerificationEmail(user.email, verificationToken, user.full_name);
            res.json({
                success: true,
                message: 'Verification email sent successfully'
            });
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try again later.'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user by email
        const [users] = await promisePool.query(
            'SELECT user_id, email, full_name FROM users WHERE email = ?',
            [email]
        );

        // Always return success to prevent email enumeration
        // In production, you might want to add rate limiting per email
        if (users.length === 0) {
            return res.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        const user = users[0];

        // Generate reset token
        const resetToken = generateSecureToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

        // Delete any existing reset tokens for this user
        await promisePool.query(
            'DELETE FROM password_reset_tokens WHERE user_id = ?',
            [user.user_id]
        );

        // Create new reset token
        await promisePool.query(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.user_id, resetToken, expiresAt]
        );

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken, user.full_name);
            res.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send password reset email. Please try again later.'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        // Find valid reset token
        const [tokens] = await promisePool.query(
            `SELECT prt.token_id, prt.user_id, prt.expires_at, prt.used, u.email
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.user_id
             WHERE prt.token = ? AND prt.used = FALSE`,
            [token]
        );

        if (tokens.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        const resetToken = tokens[0];

        // Check if token is expired
        if (new Date() > new Date(resetToken.expires_at)) {
            return res.status(400).json({
                success: false,
                message: 'Reset token has expired. Please request a new password reset.'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        // Update password and mark token as used
        await promisePool.query('START TRANSACTION');

        try {
            // Update password
            await promisePool.query(
                'UPDATE users SET password_hash = ? WHERE user_id = ?',
                [password_hash, resetToken.user_id]
            );

            // Mark token as used
            await promisePool.query(
                'UPDATE password_reset_tokens SET used = TRUE WHERE token_id = ?',
                [resetToken.token_id]
            );

            // Delete all other reset tokens for this user
            await promisePool.query(
                'DELETE FROM password_reset_tokens WHERE user_id = ? AND used = FALSE',
                [resetToken.user_id]
            );

            await promisePool.query('COMMIT');

            res.json({
                success: true,
                message: 'Password reset successfully'
            });
        } catch (error) {
            await promisePool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public (requires refresh token in cookie)
const refreshToken = async (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;

        if (!refreshTokenCookie) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not found. Please login again.'
            });
        }

        // Verify token exists in database and is not revoked
        const tokenRecord = await verifyRefreshTokenExists(refreshTokenCookie);
        if (!tokenRecord) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is invalid or expired. Please login again.'
            });
        }

        // Verify JWT signature and expiration
        try {
            jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        } catch (jwtError) {
            // Token is expired or invalid - revoke it
            await revokeRefreshToken(refreshTokenCookie);
            return res.status(401).json({
                success: false,
                message: 'Refresh token is expired. Please login again.'
            });
        }

        // Get user info
        const [users] = await promisePool.query(
            'SELECT user_id, full_name, email, role, email_verified FROM users WHERE user_id = ?',
            [tokenRecord.user_id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }

        const user = users[0];

        // Generate new access token
        const newAccessToken = generateAccessToken(user.user_id);

        res.json({
            success: true,
            message: 'Access token refreshed successfully',
            data: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                email_verified: user.email_verified
            },
            accessToken: newAccessToken
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user (revoke refresh token)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;

        // Revoke refresh token if it exists
        if (refreshTokenCookie) {
            await revokeRefreshToken(refreshTokenCookie);
        }

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    updateProfile,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
};
