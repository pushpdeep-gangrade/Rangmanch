"use strict";
var crypto = require("crypto");

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt) {
  var hash = crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value
  };
};

/*
 * Applies hashing algorithm and encrypts the password
 * @param  {string} userpassword - The user entered password to be hashed
 */
var encryptPassword = function saltHashPassword(userpassword) {
  var salt = genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = sha512(userpassword, salt);
  return passwordData;
};

/**
 * Validates the user entered password
 * @param  {object} hashedPasswordData
 * @param  {string} password
 */
var validatePassword = function validatePassword(hashedPasswordData,password){
    let newHash = sha512(password,hashedPasswordData.salt);
    if(newHash.passwordHash == hashedPasswordData.passwordHash){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {
  encryptPassword: encryptPassword,
  validatePassword:validatePassword
};
