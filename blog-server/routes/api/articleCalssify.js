const router = require('express').Router();
const { ArticleClassify } = require('./../../models');

router.post('/create', async(req, res, next) => {
  try {
    const articleClassify = await ArticleClassify.create(req.body);

    res.json({
      crea: 'success',
      msg: 'articleClassify Create Success',
      data: articleClassify
    });
    // if (req.body.dynamicImg) {

    // } else if (req.body.link)
  } catch (e) {
    next(e)
  }
})

router.get('/all', async(req, res ,next) => {
  try {
    const articleClassify = await ArticleClassify.find({});

    res.json({
      data: articleClassify
    })
  } catch (e) {
    next(e);
  }
})

router.delete('/delete', async(req, res ,next) => {
  try {
    const articleClassify = await ArticleClassify.deleteMany({ category: { $in: req.body.category } });

    res.json({
      data: articleClassify
    })
  } catch (e) {
    next(e);
  }
})


module.exports = router;