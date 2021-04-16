const router = require('express').Router();
const { Tag } = require('./../../models');

/**
 *  params {
 *    tag_category: 'user' || 'article'
 *  }
 * 
 */
router.get('/all_tags', async(req, res, next) => {
  try {
    const tags = await Tag.find(req.body);
    res.json({
      data: tags
    })
  } catch (e) {
    next(e);
  }
})

/**
 *  params {
 *    tag_category: 'user' || 'article',
 *    tag_content,
 *    tag_color,
 *    icon
 *  }
 * 
 */

router.post('/create', async(req, res, next) => {
  
  try {
    const tags = await Tag.create(req.body);
    res.json({
      data: tags
    })
  } catch (e) {
    next(e);
  }
})

module.exports = router;