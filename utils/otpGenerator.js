const crypto = require('crypto');

exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.isOtpExpired = (otpExpires) => {
  return Date.now() > otpExpires;
};
