const router = require('express').Router();
const { Comment, Article } = require('./../../models/index');
const jwt = require('jsonwebtoken');
const { publicKey }  = require('./../../plugins/common');

/**
 * get comment by article id
 * @params {
 *  topic_id
 *  user
 * }
 */
router.get('/all_comments', async(req, res, next) => {
  try {
    const handle_comment = [];
    const handle_comment_level2 = [];
    const comments = await Comment.find(req.query).populate({
      path: 'comment_user_info',
      select: '-passWord'
    }).populate({
      path: 'reply_user_info',
      select: '-passWord'
    });
    if (comments) {
      comments.forEach(val => {
        if (val.reply_level === 1) {
          handle_comment.push(Object.assign({}, val._doc));
        } else {
          handle_comment_level2.push(val);
        }
      })     
      handle_comment.forEach(val => {
        const children = handle_comment_level2.filter(data => {
          return data.parent_id == val._id;
        });
        if (children && children.length > 0) {
          val.comment_level2 = children;
        }
      })
      res.json({
        data: handle_comment
      })
    }
  } catch (e) {
    next (e)
  }
})

/**
 * push one comment
 * @params {
 *  topic_id,
 *  reply_level,
 *  author_id
 *  comment_content
 *  ?comment_user_id
 *  ?reply_comment_id,
 *  ?reply_user_info
 *  ?parent_id
 * }
 */

router.post('/release', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken'];
    const { id }= jwt.verify(token, publicKey);
    req.body.is_author = id === req.body.author_id;
    const comment = await Comment.create(Object.assign({}, req.body, {comment_user_id: id, comment_user_info: id}));
    const comm = await Comment.findById(comment.id)
    .populate({
      path: 'comment_user_info',
      select: '-passWord'
    }).populate({
      path: 'reply_user_info',
      select: '-passWord'
    });
    res.json({
      data: comm,
      release: 'success',
      msg: 'Comment Release Success!'
    })
    await Article.findByIdAndUpdate(req.body.topic_id, { $inc: { comment_count: 1}});
  }catch (e) {
    next (e)
  }
})

module.exports = router;