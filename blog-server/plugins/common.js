const getPage = require('./getdbPage');
const { setToken, verToken } = require('./user');
const publicKey = require('./publicKey');
const { getAuthorArticleInfo } = require('./utils');
module.exports = {
  getPage,
  setToken,
  verToken,
  publicKey,
  getAuthorArticleInfo
}