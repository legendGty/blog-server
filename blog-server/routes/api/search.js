const router = require('express').Router();
const { Article, Tag, User } = require('./../../models');
const jwt = require('jsonwebtoken');
const { getPage, publicKey, getAuthorArticleInfo } = require('./../../plugins/common');


router.post('/', async(req, res, next) => {
  try {
    const reg = new RegExp(req.body.query, 'i');
    const token = req.headers['x-csrftoken'];
    const { id } = jwt.verify(token, publicKey);
    const article = await Article.find({
      $or: [
        {title: { $regex:  reg }},
        {description: { $regex:  reg }},
      ]
    }).populate({ // populate digger info
      path: 'author',
      select: '-passWord'
    }).populate({
      path: 'digger_list',
      match: {
        from: 'article',
        userInfo: id
      }
    }).populate({    // populate collection info
      path: 'collection_list',
      match: {
        userInfo: id
      }
    }).exec();

    const tag = await Tag.find({
      $or: [
        {tag_content: { $regex:  reg }},
      ]
    })

    const user = await User.find({
      $or: [
        {userName: { $regex:  reg }},
      ]
    }).select('-passWord');
    res.json({
      article,
      tag,
      user
    })
  } catch (e) {
    next(e);
  }
})

module.exports = router;