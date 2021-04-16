const router = require('express').Router();
const { Article, Like } = require('./../../models');
const jwt = require('jsonwebtoken');
const publicKey = require('../../plugins/publicKey');

/**
 * @params {
 *  userInfo,
 *  ?articleInfo
 *  ?commentInfo,
 *  ? from
 * }
 * 
 */
router.post('/digger', async (req, res, next) => {
  const token = req.headers['x-csrftoken'];
  const { id } = jwt.verify(token, publicKey);
  const params = Object.assign({}, { userInfo: id }, req.body);
  try {
    const has = await Like.findOne(params);
    if (has) {
      // delete digger
      result =  await Like.findOneAndDelete(params);
      await Article.findByIdAndUpdate(result.articleInfo, { 
        $inc: { digger_count: -1 },
        $pull: { digger_list: result._id }
      }, {new: true});

      res.json({
        data: result,
        code: 2,
        msg: 'Cancel Digger Success!'
      })
    } else {
      // add digger
      result =  await Like.create(params);
      await Article.findByIdAndUpdate(result.articleInfo, { 
        $inc: { digger_count: 1 },
        $push: { digger_list: result._id }
        })
      res.json({
        data: result,
        code: 1,
        msg: 'Confirm Digger Success!'
      })
    }

  } catch(e) {
    next(e)
  }
})

module.exports = router;