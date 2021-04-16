const publicKey = require('./publicKey');
const jwt = require('jsonwebtoken');

const setToken = function (id) {
  return new Promise((resolve, reject) => {
      const token = jwt.sign({
          id: id
      }, publicKey, { expiresIn:  '1h' });
      console.log('token',token);
      resolve(token);
  })
}

const verToken = function (token) {
  return new Promise((resolve, reject) => {
      var info = jwt.verify(token, publicKey ,(error, decoded) => {
          if (error) {
            console.warn(error.message)
            return
          }
          console.log(22, decoded)
        });
      resolve(info);
  })
}

module.exports = {
  setToken,
  verToken
}