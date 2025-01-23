const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { generateOTP, isOtpExpired } = require('../utils/otpGenerator');
const { verifyRecaptcha } = require('../utils/recaptcha');
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
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
    console.log(1)
    try {
        console.log(2)
        console.log(req.body)
        // const decryptedBody = decryptData(req.body.encryptedData); // Decrypt incoming data
        const { name, mobile_no, email, date_of_birth, gender, password } = req.body;
        
        console.log(2)
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ encryptedData: encryptData({ message: 'Email already exists' }) });
        console.log(2)
        const otp = null;
        const otpExpires = null;
        console.log(2)
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
        console.log(2)
        await newUser.save();
        console.log(2)
        res.status(201).json({ encryptedData: encryptData({ message: 'Signup successful. Verify OTP sent to your email.' }) });
    } catch (error) {
        console.log(error)
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

        user.isVerified = true;
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

const sendOtpEmail = async (email, otp) => {
    try{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info@nuviontech.com',
            pass: 'koaftfceyepglhqk',
        },
    });

    const mailOptions = {
        from: 'info@nuviontech.com',
        to: email,
        subject: 'Verify Your Login',
        html: `
            <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>Login OTP</title>
    <style type="text/css">
        /* CONFIG STYLES Please do not delete and edit CSS styles below */
        /* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
        #outlook a {
            padding: 0;
        }

        .es-button {
            mso-style-priority: 100 !important;
            text-decoration: none !important;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
            mso-hide: all;
        }

        [data-ogsb] .es-button.es-button-1717749595868 {
            padding: 10px 20px !important;
        }

        /*
END OF IMPORTANT
*/
        body {
            width: 100%;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
        }

        table td,
        body,
        .es-wrapper {
            padding: 0;
            Margin: 0;
        }

        .es-content,
        .es-header,
        .es-footer {
            table-layout: fixed !important;
            width: 100%;
        }

        img {
            display: block;
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p,
        hr {
            Margin: 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5 {
            Margin: 0;
            line-height: 120%;
            mso-line-height-rule: exactly;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
        }

        p,
        ul li,
        ol li,
        a {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            mso-line-height-rule: exactly;
        }

        .es-left {
            float: left;
        }

        .es-right {
            float: right;
        }

        .es-p5 {
            padding: 5px;
        }

        .es-p5t {
            padding-top: 5px;
        }

        .es-p5b {
            padding-bottom: 5px;
        }

        .es-p5l {
            padding-left: 5px;
        }

        .es-p5r {
            padding-right: 5px;
        }

        .es-p10 {
            padding: 10px;
        }

        .es-p10t {
            padding-top: 10px;
        }

        .es-p10b {
            padding-bottom: 10px;
        }

        .es-p10l {
            padding-left: 10px;
        }

        .es-p10r {
            padding-right: 10px;
        }

        .es-p15 {
            padding: 15px;
        }

        .es-p15t {
            padding-top: 15px;
        }

        .es-p15b {
            padding-bottom: 15px;
        }

        .es-p15l {
            padding-left: 15px;
        }

        .es-p15r {
            padding-right: 15px;
        }

        .es-p20 {
            padding: 20px;
        }

        .es-p20t {
            padding-top: 20px;
        }

        .es-p20b {
            padding-bottom: 20px;
        }

        .es-p20l {
            padding-left: 20px;
        }

        .es-p20r {
            padding-right: 20px;
        }

        .es-p25 {
            padding: 25px;
        }

        .es-p25t {
            padding-top: 25px;
        }

        .es-p25b {
            padding-bottom: 25px;
        }

        .es-p25l {
            padding-left: 25px;
        }

        .es-p25r {
            padding-right: 25px;
        }

        .es-p30 {
            padding: 30px;
        }

        .es-p30t {
            padding-top: 30px;
        }

        .es-p30b {
            padding-bottom: 30px;
        }

        .es-p30l {
            padding-left: 30px;
        }

        .es-p30r {
            padding-right: 30px;
        }

        .es-p35 {
            padding: 35px;
        }

        .es-p35t {
            padding-top: 35px;
        }

        .es-p35b {
            padding-bottom: 35px;
        }

        .es-p35l {
            padding-left: 35px;
        }

        .es-p35r {
            padding-right: 35px;
        }

        .es-p40 {
            padding: 40px;
        }

        .es-p40t {
            padding-top: 40px;
        }

        .es-p40b {
            padding-bottom: 40px;
        }

        .es-p40l {
            padding-left: 40px;
        }

        .es-p40r {
            padding-right: 40px;
        }

        .es-menu td {
            border: 0;
        }

        .es-menu td a img {
            display: inline-block !important;
            vertical-align: middle;
        }

        /*
END CONFIG STYLES
*/
        s {
            text-decoration: line-through;
        }

        p,
        ul li,
        ol li {
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            line-height: 150%;
        }

        ul li,
        ol li {
            Margin-bottom: 15px;
            margin-left: 0;
        }

        a {
            text-decoration: underline;
        }

        .es-menu td a {
            text-decoration: none;
            display: block;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
        }

        .es-wrapper {
            width: 100%;
            height: 100%;
            background-repeat: repeat;
            background-position: center top;
        }

        .es-wrapper-color,
        .es-wrapper {
            background-color: #ffffff;
        }

        .es-header {
            background-color: transparent;
            background-repeat: repeat;
            background-position: center top;
        }

        .es-header-body {
            background-color: #ffffff;
        }

        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li {
            color: #333333;
            font-size: 14px;
        }

        .es-header-body a {
            color: #2cb543;
            font-size: 14px;
        }

        .es-content-body {
            background-color: #ffffff;
        }

        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li {
            color: #333333;
            font-size: 14px;
        }

        .es-content-body a {
            color: #2cb543;
            font-size: 14px;
        }

        .es-footer {
            background-color: transparent;
            background-repeat: repeat;
            background-position: center top;
        }

        .es-footer-body {
            background-color: #ffffff;
        }

        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li {
            color: #333333;
            font-size: 14px;
        }

        .es-footer-body a {
            color: #2cb543;
            font-size: 14px;
        }

        .es-infoblock,
        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li {
            line-height: 120%;
            font-size: 12px;
            color: #cccccc;
        }

        .es-infoblock a {
            font-size: 12px;
            color: #cccccc;
        }

        h1 {
            font-size: 30px;
            font-style: normal;
            font-weight: normal;
            color: #333333;
        }

        h2 {
            font-size: 24px;
            font-style: normal;
            font-weight: normal;
            color: #333333;
        }

        h3 {
            font-size: 20px;
            font-style: normal;
            font-weight: normal;
            color: #333333;
        }

        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
            font-size: 30px;
        }

        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
            font-size: 24px;
        }

        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
            font-size: 20px;
        }

        a.es-button,
        button.es-button {
            display: inline-block;
            background: #31cb4b;
            border-radius: 30px;
            font-size: 18px;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            font-weight: normal;
            font-style: normal;
            line-height: 120%;
            color: #ffffff;
            text-decoration: none;
            width: auto;
            text-align: center;
            padding: 10px 20px 10px 20px;
            mso-padding-alt: 0;
            mso-border-alt: 10px solid #31cb4b;
        }

        .es-button-border {
            border-style: solid solid solid solid;
            border-color: #2cb543 #2cb543 #2cb543 #2cb543;
            background: #31cb4b;
            border-width: 0px 0px 2px 0px;
            display: inline-block;
            border-radius: 30px;
            width: auto;
        }

        .msohide {
            mso-hide: all;
        }

        /* RESPONSIVE STYLES Please do not delete and edit CSS styles below. If you don't need responsive layout, please delete this section. */
        @media only screen and (max-width: 600px) {

            p,
            ul li,
            ol li,
            a {
                line-height: 150% !important;
            }

            h1,
            h2,
            h3,
            h1 a,
            h2 a,
            h3 a {
                line-height: 120% !important;
            }

            h1 {
                font-size: 30px !important;
                text-align: left;
            }

            h2 {
                font-size: 24px !important;
                text-align: left;
            }

            h3 {
                font-size: 20px !important;
                text-align: left;
            }

            .es-header-body h1 a,
            .es-content-body h1 a,
            .es-footer-body h1 a {
                font-size: 30px !important;
                text-align: left;
            }

            .es-header-body h2 a,
            .es-content-body h2 a,
            .es-footer-body h2 a {
                font-size: 24px !important;
                text-align: left;
            }

            .es-header-body h3 a,
            .es-content-body h3 a,
            .es-footer-body h3 a {
                font-size: 20px !important;
                text-align: left;
            }

            .es-menu td a {
                font-size: 14px !important;
            }

            .es-header-body p,
            .es-header-body ul li,
            .es-header-body ol li,
            .es-header-body a {
                font-size: 14px !important;
            }

            .es-content-body p,
            .es-content-body ul li,
            .es-content-body ol li,
            .es-content-body a {
                font-size: 14px !important;
            }

            .es-footer-body p,
            .es-footer-body ul li,
            .es-footer-body ol li,
            .es-footer-body a {
                font-size: 14px !important;
            }

            .es-infoblock p,
            .es-infoblock ul li,
            .es-infoblock ol li,
            .es-infoblock a {
                font-size: 12px !important;
            }

            *[class="gmail-fix"] {
                display: none !important;
            }

            .es-m-txt-c,
            .es-m-txt-c h1,
            .es-m-txt-c h2,
            .es-m-txt-c h3 {
                text-align: center !important;
            }

            .es-m-txt-r,
            .es-m-txt-r h1,
            .es-m-txt-r h2,
            .es-m-txt-r h3 {
                text-align: right !important;
            }

            .es-m-txt-l,
            .es-m-txt-l h1,
            .es-m-txt-l h2,
            .es-m-txt-l h3 {
                text-align: left !important;
            }

            .es-m-txt-r img,
            .es-m-txt-c img,
            .es-m-txt-l img {
                display: inline !important;
            }

            .es-button-border {
                display: inline-block !important;
            }

            a.es-button,
            button.es-button {
                font-size: 18px !important;
                display: inline-block !important;
            }

            .es-adaptive table,
            .es-left,
            .es-right {
                width: 100% !important;
            }

            .es-content table,
            .es-header table,
            .es-footer table,
            .es-content,
            .es-footer,
            .es-header {
                width: 100% !important;
                max-width: 600px !important;
            }

            .es-adapt-td {
                display: block !important;
                width: 100% !important;
            }

            .adapt-img {
                width: 100% !important;
                height: auto !important;
            }

            .es-m-p0 {
                padding: 0 !important;
            }

            .es-m-p0r {
                padding-right: 0 !important;
            }

            .es-m-p0l {
                padding-left: 0 !important;
            }

            .es-m-p0t {
                padding-top: 0 !important;
            }

            .es-m-p0b {
                padding-bottom: 0 !important;
            }

            .es-m-p20b {
                padding-bottom: 20px !important;
            }

            .es-mobile-hidden,
            .es-hidden {
                display: none !important;
            }

            tr.es-desk-hidden,
            td.es-desk-hidden,
            table.es-desk-hidden {
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                line-height: inherit !important;
            }

            tr.es-desk-hidden {
                display: table-row !important;
            }

            table.es-desk-hidden {
                display: table !important;
            }

            td.es-desk-menu-hidden {
                display: table-cell !important;
            }

            .es-menu td {
                width: 1% !important;
            }

            table.es-table-not-adapt,
            .esd-block-html table {
                width: auto !important;
            }

            table.es-social {
                display: inline-block !important;
            }

            table.es-social td {
                display: inline-block !important;
            }

            .es-desk-hidden {
                display: table-row !important;
                width: auto !important;
                overflow: visible !important;
                max-height: inherit !important;
            }

            .es-m-p5 {
                padding: 5px !important;
            }

            .es-m-p5t {
                padding-top: 5px !important;
            }

            .es-m-p5b {
                padding-bottom: 5px !important;
            }

            .es-m-p5r {
                padding-right: 5px !important;
            }

            .es-m-p5l {
                padding-left: 5px !important;
            }

            .es-m-p10 {
                padding: 10px !important;
            }

            .es-m-p10t {
                padding-top: 10px !important;
            }

            .es-m-p10b {
                padding-bottom: 10px !important;
            }

            .es-m-p10r {
                padding-right: 10px !important;
            }

            .es-m-p10l {
                padding-left: 10px !important;
            }

            .es-m-p15 {
                padding: 15px !important;
            }

            .es-m-p15t {
                padding-top: 15px !important;
            }

            .es-m-p15b {
                padding-bottom: 15px !important;
            }

            .es-m-p15r {
                padding-right: 15px !important;
            }

            .es-m-p15l {
                padding-left: 15px !important;
            }

            .es-m-p20 {
                padding: 20px !important;
            }

            .es-m-p20t {
                padding-top: 20px !important;
            }

            .es-m-p20r {
                padding-right: 20px !important;
            }

            .es-m-p20l {
                padding-left: 20px !important;
            }

            .es-m-p25 {
                padding: 25px !important;
            }

            .es-m-p25t {
                padding-top: 25px !important;
            }

            .es-m-p25b {
                padding-bottom: 25px !important;
            }

            .es-m-p25r {
                padding-right: 25px !important;
            }

            .es-m-p25l {
                padding-left: 25px !important;
            }

            .es-m-p30 {
                padding: 30px !important;
            }

            .es-m-p30t {
                padding-top: 30px !important;
            }

            .es-m-p30b {
                padding-bottom: 30px !important;
            }

            .es-m-p30r {
                padding-right: 30px !important;
            }

            .es-m-p30l {
                padding-left: 30px !important;
            }

            .es-m-p35 {
                padding: 35px !important;
            }

            .es-m-p35t {
                padding-top: 35px !important;
            }

            .es-m-p35b {
                padding-bottom: 35px !important;
            }

            .es-m-p35r {
                padding-right: 35px !important;
            }

            .es-m-p35l {
                padding-left: 35px !important;
            }

            .es-m-p40 {
                padding: 40px !important;
            }

            .es-m-p40t {
                padding-top: 40px !important;
            }

            .es-m-p40b {
                padding-bottom: 40px !important;
            }

            .es-m-p40r {
                padding-right: 40px !important;
            }

            .es-m-p40l {
                padding-left: 40px !important;
            }
        }

        /* END RESPONSIVE STYLES */
    </style>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
</head>

<body>
    <div dir="ltr" class="es-wrapper-color">
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table class="es-footer esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0"
                                            bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p5b es-p20r es-p20l"
                                                        style="background-color: #f2ebfe;" bgcolor="#f2ebfe"
                                                        align="left">
                                                        <table cellspacing="0" cellpadding="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="560"
                                                                        align="left">
                                                                        <table width="100%" cellspacing="0"
                                                                            cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-image es-m-txt-c"
                                                                                        align="center"
                                                                                        style="font-size: 0px;">
                                                                                        <a target="_blank"><img
                                                                                                src="https://dbrbob.stripocdn.email/content/guids/CABINET_ff06f0f6afff91e4506ef568b46158c8/images/9971551871821025.png"
                                                                                                alt
                                                                                                style="display: block;"
                                                                                                width="168"></a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p10t es-p20b es-p40r es-p40l"
                                                        align="left" bgcolor="#f2ebfe"
                                                        style="background-color: #f2ebfe;">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="520" class="esd-container-frame"
                                                                        align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0"
                                                                            width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center"
                                                                                        class="esd-block-banner"
                                                                                        style="position: relative;"
                                                                                        esdev-config="h2">
                                                                                        <a target="_blank"><img
                                                                                                class="adapt-img esdev-stretch-width esdev-banner-rendered"
                                                                                                src="https://dbrbob.stripocdn.email/content/guids/bannerImgGuid/images/image17177504663519030.png"
                                                                                                alt title width="520"
                                                                                                style="display: block;"></a>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center"
                                                                                        class="esd-block-text es-p15t es-p10b es-p10r es-p10l"
                                                                                        bgcolor="#ffffff">
                                                                                        <p
                                                                                            style="line-height: 150%; font-size: 22px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; color: #000000;">
                                                                                            <strong>Login
                                                                                                Verification</strong>
                                                                                        </p>
                                                                                        <p
                                                                                            style="line-height: 150%; font-size: 17px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; color: #000000;line-height: 2.5;">
                                                                                            <strong> Dear
                                                                                                User, </strong>
                                                                                        </p>
                                                                                        <p
                                                                                            style="line-height: 150%; font-size: 14px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; color: #000000;">
                                                                                            <strong> Here is your OTP
                                                                                                for login: 
                                                                                        </p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center"
                                                                                        class="esd-block-button es-p10t es-p10b"
                                                                                        bgcolor="#ffffff">
                                                                                        <span
                                                                                            class="msohide es-button-border"
                                                                                            style="border-radius: 23px; border-width: 0px; border-color: #2cb543; background: #9e32a2;">
                                                                                            <a href
                                                                                                class="es-button es-button-1717749595868"
                                                                                                onclick="copyOTP(event)"
                                                                                                style="border-radius: 23px; background: #9e32a2; padding: 10px 20px; font-weight: bold; font-family: roboto, helvetica neue, helvetica, arial, sans-serif; font-size: 22px; mso-border-alt: 10px solid #9e32a2">
                                                                                                </strong><strong>${otp}</strong></a></span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center"
                                                                                        class="esd-block-text es-p10"
                                                                                        bgcolor="#ffffff">
                                                                                        <p
                                                                                            style="line-height: 150%; font-size: 13px; font-family: arial, 'helvetica neue', helvetica, sans-serif; color: #000000;">
                                                                                            Click on button to copy
                                                                                            code.</p>
                                                                                        <p
                                                                                            style="line-height: 150%; font-size: 13px; font-family: arial, 'helvetica neue', helvetica, sans-serif; color: #000000;">
                                                                                            If you did not request this
                                                                                            code, please ignore this
                                                                                            email.</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table class="es-footer-body"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                                        cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none">
                                        <tr>
                                            <td style="padding:0;Margin:0;padding-left:40px;padding-right:40px;background-color:#f2ebfe"
                                                bgcolor="#e6fde5" align="left">
                                                <table width="100%" cellspacing="0" cellpadding="0" role="none"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td valign="top" align="center"
                                                            style="padding:0;Margin:0;width:520px">
                                                            <table width="100%" cellspacing="0" cellpadding="0"
                                                                role="presentation"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px">
                                                                        <table class="es-table-not-adapt es-social"
                                                                            cellspacing="0" cellpadding="0"
                                                                            role="presentation"
                                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                            <tr>
                                                                                <td valign="top" align="center"
                                                                                    style="padding:0;Margin:0;padding-right:10px">
                                                                                    <img title="Facebook"
                                                                                        src="https://dbrbob.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png"
                                                                                        alt="Fb" width="32" height="32"
                                                                                        style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                                                                </td>
                                                                                <td valign="top" align="center"
                                                                                    style="padding:0;Margin:0;padding-right:10px">
                                                                                    <img title="Instagram"
                                                                                        src="https://dbrbob.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png"
                                                                                        alt="Inst" width="32"
                                                                                        height="32"
                                                                                        style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                                                                </td>
                                                                                <td valign="top" align="center"
                                                                                    style="padding:0;Margin:0;padding-right:10px">
                                                                                    <img title="Gmail"
                                                                                        src="https://dbrbob.stripocdn.email/content/assets/img/other-icons/logo-colored/gmail-logo-colored.png"
                                                                                        alt="gm" width="32" height="32"
                                                                                        style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                                                                </td>
                                                                                <td valign="top" align="center"
                                                                                    style="padding:0;Margin:0"><img
                                                                                        title="World"
                                                                                        src="https://dbrbob.stripocdn.email/content/assets/img/other-icons/logo-colored/globe-logo-colored.png"
                                                                                        alt="World" width="32"
                                                                                        height="32"
                                                                                        style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px">
                                                                        <p
                                                                            style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:30px;color:#999999;font-size:20px">
                                                                            <strong><span
                                                                                    style="color:#000000">Copyright ©
                                                                                    2024, Sahitya Hills</span></strong>
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#999999;font-size:14px">
                                                                            Thank you for choosing Sahitya Hills.</p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        function copyOTP(event) {
            var button = event.target; // Get the clicked button element
            var otp = button.textContent.trim(); // Get the text content of the button and remove any leading/trailing spaces

            // Create a temporary textarea element to copy the OTP to clipboard
            var tempTextarea = document.createElement('textarea');
            tempTextarea.value = otp; // Set the value of the textarea to the OTP text
            document.body.appendChild(tempTextarea); // Append the textarea element to the document

            // Select the content of the textarea
            tempTextarea.select();
            tempTextarea.setSelectionRange(0, 99999); // For mobile devices

            // Copy the selected text to clipboard
            document.execCommand('copy');

            // Remove the temporary textarea element
            document.body.removeChild(tempTextarea);

            // Display the message "OTP is copied"
            var copyMessage = document.getElementById('copyMessage');
            copyMessage.style.display = 'inline'; // Show the message
            setTimeout(function () {
                copyMessage.style.display = 'none'; // Hide the message after 2 seconds
            }, 2000);
        }



    </script>
</body>

</html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);  //MAIL SENT HERE
        console.log('OTP email sent successfully');
        
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
    } catch (error) {
        console.error('Error :', error);
        return res.status(400).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        console.log(req.body)
        const decryptedBody = decryptData(req.body.encryptedData); // Decrypt incoming data
        console.log(decryptedBody)
        const { email, password } = decryptedBody;

        // Verify reCAPTCHA
        // const recaptchaValid = await verifyRecaptcha(recaptchaToken);
        // if (!recaptchaValid) {
        //     return res.status(400).json({ encryptedData: encryptData({ message: 'reCAPTCHA verification failed' }) });
        // }

        const user = await User.findOne({email});
        console.log(user)
        if (!user) return res.status(401).json({ encryptedData: encryptData({ message: 'User not found' }) });

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(400).json({ encryptedData: encryptData({ message: 'Invalid credentials' }) });

        console.log(user.password)
        console.log(password)
        if (password !== user.password) {
            return res.status(400).json({ encryptedData: encryptData({ message: 'Invalid credentials' }) });
        }

        if (!user.isVerified) {
            const otp = generateOTP();
            const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRATION);

            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
            console.log(otp)
            sendOtpEmail(email, otp);
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
