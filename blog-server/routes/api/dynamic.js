const router = require('express').Router();
const { Dynamic } = require('./../../models');
const jwt = require('jsonwebtoken');
const publicKey = require('../../plugins/publicKey');

router.post('/publish', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken'];
    const { id } = jwt.verify(token, publicKey);
    const params = {
      author_user_info: id,
      content: req.body.content,
      link_parse_content: req.body.link_parse_content
    };

    const dynamic = await Dynamic.create(params);

    res.json({
      publish: 'success',
      msg: 'Dynamic Create Success',
      data: dynamic
    });
  } catch (e) {
    next(e)
  }
})

router.get('/all_dynamics', async(req, res ,next) => {
  try {
    const dynamics = await Dynamic.find({}).populate('author_user_info');

    res.json({
      data: dynamics
    })
  } catch (e) {
    next(e);
  }
})

module.exports = router;