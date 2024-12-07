const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { generateOTP, isOtpExpired } = require('../utils/otpGenerator');
const { verifyRecaptcha } = require('../utils/recaptcha');
const mongoose = require("mongoose");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "a76e9f32c4a0a9e7r8y5g6r4e8f9g6dgb271f51aa9785d29a3b1d4a76e9f32c4a7f400f6c1820a97856b7f400fef12ab08c7f630ec15b3d866a148634b43dfe3dc1820a978564e896db2"; // Replace with your secure key

// Utility functions for encryption and decryption
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

exports.signup = async (req, res) => {
    try {
        const decryptedBody = decryptData(req.body.encryptedData); // Decrypt incoming data
        const { name, mobile_no, email, date_of_birth, gender, password } = decryptedBody;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ encryptedData: encryptData({ message: 'Email already exists' }) });

        const otp = null;
        const otpExpires = null;

        const newUser = new User({
            name,
            mobile_no,
            email,
            date_of_birth,
            gender,
            password,
            otp,
            otpExpires
        });

        await newUser.save();

        res.status(201).json({ encryptedData: encryptData({ message: 'Signup successful. Verify OTP sent to your email.' }) });
    } catch (error) {
        res.status(500).json({ encryptedData: encryptData({ message: 'Server error' }) });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const decryptedBody = decryptData(req.body.encryptedData); // Decrypt incoming data
        const { email, otp, recaptchaToken } = decryptedBody;

        // Verify reCAPTCHA
        const recaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaValid) {
            return res.status(400).json({ encryptedData: encryptData({ message: 'reCAPTCHA verification failed' }) });
        }

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ encryptedData: encryptData({ message: 'User not found' }) });

        if (user.otp !== otp || isOtpExpired(user.otpExpires)) {
            return res.status(400).json({ encryptedData: encryptData({ message: 'Invalid or expired OTP' }) });
        }

        user.isVerified = false;
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        const token = jwt.sign(
            { id: user._id.toHexString(), email: user.email, mobile: user.mobile_no },
            process.env.JWT_SECRET
        );

        res.status(200).json({
            encryptedData: encryptData({
                message: 'Login successful',
                token,
                id: user._id.toHexString(),
                email: user.email,
                mobile: user.mobile_no,
                name: user.name
            })
        });
    } catch (error) {
        res.status(500).json({ encryptedData: encryptData({ message: 'Server error' }) });
    }
};

exports.login = async (req, res) => {
    try {

        const decryptedBody = decryptData(req.body.encryptedData); // Decrypt incoming data

        const { email, password, recaptchaToken } = decryptedBody;

        // Verify reCAPTCHA
        const recaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaValid) {
            return res.status(400).json({ encryptedData: encryptData({ message: 'reCAPTCHA verification failed' }) });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ encryptedData: encryptData({ message: 'User not found' }) });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ encryptedData: encryptData({ message: 'Invalid credentials' }) });

        if (!user.isVerified) {
            const otp = generateOTP();
            const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRATION);

            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();

            return res.status(400).json({
                encryptedData: encryptData({
                    message: 'Account not verified. OTP has been sent to your email.',
                    otpSent: true
                })
            });
        }

        const token = jwt.sign(
            { id: user._id.toHexString(), email: user.email, mobile: user.mobile_no },
            process.env.JWT_SECRET
        );

        res.status(200).json({
            encryptedData: encryptData({
                message: 'Login successful',
                token,
                id: user._id.toHexString(),
                email: user.email,
                mobile: user.mobile_no,
                name: user.name
            })
        });
    } catch (error) {
        res.status(500).json({ encryptedData: encryptData({ message: 'Server error' }) });
    }
};
