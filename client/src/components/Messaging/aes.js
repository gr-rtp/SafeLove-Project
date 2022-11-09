var CryptoJS = require("crypto-js");

var key = process.env.REACT_APP_KEY;

export const encryptMessage = (text) => {
  var encrypted = CryptoJS.AES.encrypt(text, key).toString();;
  return encrypted;
};
export const decryptMessage = (cipher) => {
  var decrypted = CryptoJS.AES.decrypt(cipher, key);
  return decrypted.toString(CryptoJS.enc.Utf8)
 
};