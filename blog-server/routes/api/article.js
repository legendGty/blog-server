const router = require('express').Router();
const { Article } = require('./../../models');
const jwt = require('jsonwebtoken');
const { getPage, publicKey, getAuthorArticleInfo } = require('./../../plugins/common');
/**
 * get all types articles
 * @params {
 *  page,
 *  size
 * }
 */
router.get('/all_articles', async (req, res, next) => {
  try {
    const category = req.query.category ? {category: decodeURIComponent(req.query.category)} : {};
    const token = req.headers['x-csrftoken'];
    const { id } = jwt.verify(token, publicKey);
    const allArticles = await getPage(Article, req.query.page, req.query.size, category, id);
    res.send(allArticles);
  } catch(e) {
    next(e)
  }
})

/**
 * get articles detail By article id
 * @params {
 *  id
 * }
 */
router.get('/detail/:id', async (req, res, next) => {
  try {
    const token = req.headers['x-csrftoken'];
    const { id } = jwt.verify(token, publicKey);
    const article = await Article.findByIdAndUpdate(req.params.id, {
      $inc: {
        view_count: 10
      }
    }, {new: true}).populate({ // populate digger info
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
    const userId = article.author._id;
    const user_article = await getAuthorArticleInfo(Article, userId);
    res.json({
      article,
      user_article
    });
  } catch(e) {
    next(e)
  }
})

/**
 * get all articles By user id
 * @params {
 *  page,
 *  size
 * }
 */
router.get('/all_user_articles', async (req, res, next) => {
  try {
    const token = req.headers['x-csrftoken'];
    const decode = jwt.verify(token, publicKey);
    const filter = { author: decode.id};
    const allArticles = await getPage(Article, req.query.page, req.query.size, filter);
    res.send(allArticles);
  } catch(e) {
    next(e)
  }
})

/**
 * release one article By user id
 * params {
 *  title,
 *  description
 * }
 */

router.post('/release_article', async (req, res, next) => {
  try {
    const token = req.headers['x-csrftoken'];
    const { id } = jwt.verify(token, publicKey);
    const article = await Article.create(Object.assign({}, { author: id }, req.body));
    // await Article.findByIdAndUpdate(article._id, { like: article._id });
    res.json({
      data: article,
      release_article: "success",
      msg: "Release Article Success！"
    })
    /**
     * To Do 
     * Article subscription push
     */
  } catch (e) {
    next(e)
  }
});

/**
 * update Tags  By article id
 * @params {
 *  tags: []
 * }
 */

router.post('/add_tags/:id', async (req, res, next) => {
  try {
    const result = await Article.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        article_tags: { $each: req.body.tags }
      }
    });
    await Tag.updateMany({
      _id: { $in: req.body.tags}
    }, {
      $inc: {
        post_article_count: 1
      }
    })
    res.send(result);
  } catch(e) {
    next(e)
  }
})

router.post('/remove/:id', async (req, res, next) => {
  try {
    const result = await Article.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        article_tags: { $each: req.body.tags }
      }
    });
    await Tag.updateMany({
      _id: { $in: req.body.tags}
    }, {
      $inc: {
        post_article_count: -1
      }
    })
    res.send(result);
  } catch(e) {
    next(e)
  }
})


router.post('/remove_tags', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken']
    const { id } = jwt.verify(token, publicKey);

    const user = await User.findByIdAndUpdate(id, {
      $pullAll: {
        article_tags: req.body.tags
      }
    });

    await Tag.updateMany({
      _id: { $in: req.body.tags}
    }, {
      $inc: {
        concern_user_count: -1
      }
    })
    res.json({
      data: user,
      remove: 'success',
      msg: 'User Remove Tags Success'
    })

  } catch (err) {
    next(err);
  }
});
/**
 * update one article By article id
 * @params {
 * }
 */

router.put('/update/:id', async (req, res, next) => {
  try {
    const result = await Article.findByIdAndUpdate(req.params.id, req.body);
    res.send(result);
  } catch(e) {
    next(e)
  }
})


/**
 * delete one article By article id
 * @params {
 *  page,
 *  size
 * }
 */

router.delete('/remove/:id', async (req, res, next) => {
  try {
    const result = await Article.findByAndDelete(req.params.id);
    res.send(result);
  } catch(e) {
    next(e)
  }
})

module.exports = router;