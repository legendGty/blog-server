const router = require('express').Router();
const { Article, Collection } = require('./../../models');
const jwt = require('jsonwebtoken');
const publicKey = require('../../plugins/publicKey');

/**
 * @params {
 *  userInfo,
 *  articleInfo
 * }
 * 
 */
router.post('/operation', async (req, res, next) => {
  const token = req.headers['x-csrftoken'];
  const { id } = jwt.verify(token, publicKey);
  const params = Object.assign({}, { userInfo: id }, req.body);
  try {
    const has = await Collection.findOne(params);
    if (has) {
      // delete collection
      result =  await Collection.findOneAndDelete(params);
      await Article.findByIdAndUpdate(result.articleInfo, { 
        $inc: { collection_count: -1 },
        $pull: { collection_list: result._id }
      }, {new: true});

      res.json({
        data: result,
        code: 2,
        msg: 'Cancel Collection Success!'
      })
    } else {
      // add collection
      result =  await Collection.create(params);
      await Article.findByIdAndUpdate(result.articleInfo, { 
        $inc: { collection_count: 1 },
        $push: { collection_list: result._id }
        })
      res.json({
        data: result,
        code: 1,
        msg: 'Confirm Collection Success!'
      })
    }

  } catch(e) {
    next(e)
  }
})

module.exports = router;