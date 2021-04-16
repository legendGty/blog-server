const router = require('express').Router();

const { User, Tag, Article } = require('./../../models');
const { setToken, publicKey, getAuthorArticleInfo }  = require('./../../plugins/common');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Registered users
 * @params {
 *  username,
 *  password
 * }
 */

router.post('/register', async(req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const psw = bcrypt.hashSync(req.body.password, salt);
    const user = await User.create({
      passWord: psw,
      userName: req.body.username
    })

    const token = await setToken(user.id);

    res.json({
      register: 'success',
      msg: "Registered users success",
      token: token
    })

  } catch (err) {
    next(err);
  }
});

/**
 * Verify the user name is available
 * @params {
 *  username
 * }
 */

router.post('/verify_name', async(req, res, next) => {
  try {
    const user = await User.find({ userName: req.body.username });
    if (user.length) {
      res.json({
        verify_pass: 'fail',
        msg: "The user name already exists!"
      });
    } else {
      res.json({
        verify_pass: 'success',
        msg: "The user name is available!"
      })
    }

  } catch (err) {
    next(err);
  }
});

router.get('/user_all_info', async(req, res, next) => {
  try {
    // const o = {};
    // o.map = function () { emit(this.author, {
    //   article_amount: 1,
    //   digger_count: this.digger_count,
    //   collection_count: this.collection_count,
    //   comment_count: this.comment_count,
    //   view_count: this.view_count
    // }) }
    // o.reduce = function (k, vals) {
    //   const result = {
    //     article_amount: 0,
    //     digger_count: 0,
    //     collection_count: 0,
    //     view_count: 0,
    //     comment_count: 0
    //   }
    //   vals.forEach(data => {
    //     result.article_amount += data.article_amount;
    //     result.digger_count += data.digger_count;
    //     result.collection_count += data.article_amount;
    //     result.comment_count += data.comment_count
    //     result.view_count += data.view_count
    //   })
    //   return result
    // }
    // o.query = { author: req.query.id };
    const articles = await getAuthorArticleInfo(Article, req.query.id);
    const user = await User.findById(req.query.id).select('-passWord')
      .populate({
        path: 'user_tags',
    })
    const latestArticle = await Article.find({author: req.query.id}).sort('-createdAt');
    res.json({
      data: {
        user,
        articles,
        latestArticle: latestArticle.length ? latestArticle[0] : null
      }
    })
  } catch(e) {
    next(e)
  }
})
/**
 * User Login
 * @params {
 *  username,
 *  password
 * }
 */

router.post('/login', async(req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      userName: username,
    })
    if (user) {
      const psw = bcrypt.compareSync(password, user.passWord);
      // compare the old password with the new password
      if (psw) {
        const token = await setToken(user.id);
        res.json({
          msg: "User Login success",
          login: "success",
          user,
          token
        })
      } else {
        res.json({
          msg: "Password Input Error",
          login: "fail"
        })
      }
    } else {
      res.json({
        msg: "User Name Input Error",
        login: "fail"
      })
    }
  } catch (err) {
    next(err);
  }
});


/**
 * get user Tags
 * 
 */

router.get('/user_tags/:id', async(req, res, next) => {
  try {
    // const token = req.headers['x-csrftoken'];
    // const { id } = jwt.verify(token, publicKey);
    const tags = await User.findById(req.params.id).populate('user_tags');
    res.json({
      data: tags.user_tags
    })
  } catch (e) {
    next(e)
  }
})

/**
 *  Update User Tags
 *  @params {
 *    tags: []
 *  }
 */

router.post('/add_tags', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken']
    const { id } = jwt.verify(token, publicKey);

    const user = await User.findByIdAndUpdate(id, {
      $addToSet: {
        user_tags: { $each: req.body.tags }
      }
    }, {
      new: true
    });

    await Tag.updateMany({
      _id: { $in: req.body.tags}
    }, {
      $inc: {
        concern_user_count: 1
      }
    }, {new: true})

    res.json({
      data: user,
      add: 'success',
      msg: 'User Add Tags Success'
    })

  } catch (err) {
    next(err);
  }
});

router.post('/remove_tags', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken']
    const { id } = jwt.verify(token, publicKey);

    const user = await User.findByIdAndUpdate(id, {
      $pullAll: {
        user_tags: req.body.tags
      }
    }, {
      new: true
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
 *  Get User Info
 *  @params {
 *  }
 */

router.get('/get_user_info', async(req, res, next) => {
  try {
    let id = null;
    if (req.query.id === null) {
      id = req.query.id
    } else {
      const token = req.headers['x-csrftoken'];
      decode = jwt.verify(token, publicKey);
      id = decode.id
    }
    const user = await User.findById(id).select('-passWord');

    res.json({
      data: user
    })
    
  } catch (e) {
    next(e)
  }
})

/**
 *  Update User Info
 *  @params {
 *    ?birthday,
 *    ?sex,
 *    ?identity,
 *    ?work,
 *    ?skill
 *  }
 */

router.post('/update_user_info', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken']
    const { id } = jwt.verify(token, publicKey);
    
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true
    });

    res.json({
      data: user,
      update: 'success',
      msg: 'Update User Info Success'
    })

  } catch (err) {
    next(err);
  }
});

/**
 * Reset Password
 * @params {
 *  old_password,
 *  new_password
 * }
 */

router.put('/reset_pwd', async(req, res, next) => {
  try {
    const token = req.headers['x-csrftoken']
    const { id } = jwt.verify(token, publicKey);
    const { old_password, new_password } = req.body;

    const user = await User.findById(id)
    const psw_correct = bcrypt.compareSync(old_password, user.passWord)
    if (psw_correct) {
      const salt = bcrypt.genSaltSync(10);
      const pwd = bcrypt.hashSync(new_password, salt);
      user.passWord = pwd;
      await user.save()
      res.json({
        user,
        msg: "Reset Password Success!",
        reset_pwd: "success"
      });
    } else {
      res.json({
        msg: "Old Password Input Error, Please try again!",
        reset_pwd: "fail"
      });
    }

  } catch (err) {
    next(err);
  }
});

module.exports = router;