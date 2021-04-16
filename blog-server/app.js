var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var expressJwt = require('express-jwt');
var { verToken, publicKey } = require('./plugins/common');
var cors = require('cors');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/Blog_server", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("mongodb connect success");
}).catch(err => console.log(err));
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // use cors to solve
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });
app.use(function (req, res, next) {
  var token = req.headers['x-csrftoken'];
  if (token === undefined) {
    return next()
  } else {
    verToken(token).then((data) => {
      req.data = data;
      return next()
    }, (err) => {
      return next();
    })
  }
})


const unlessUrl = [
  '/user/register',
  '/user/verify_name',
  '/user/login',
  '/common/upload_editor',
  '/article_classify/create',
  '/article_classify/delete'
]

app.use(expressJwt({
  secret: publicKey,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers['x-csrftoken']) {
      return req.headers['x-csrftoken'];
    }
    return null
  }
}).unless({
  path: unlessUrl
}));

app.use('/article', require('./routes/api/article'));
app.use('/user', require('./routes/api/user'));
app.use('/like', require('./routes/api/like'));
app.use('/tag', require('./routes/api/tag'));
app.use('/collection', require('./routes/api/collection'));
app.use('/comment', require('./routes/api/comment'));
app.use('/common', require('./routes/api/upload'));
app.use('/link', require('./routes/api/link'));
app.use('/dynamic', require('./routes/api/dynamic'));
app.use('/article_classify', require('./routes/api/articleCalssify'));
app.use('/search', require('./routes/api/search'));

// const global = fs.readdirSync(__dirname)
// console.log(global, __dirname);
// console.log(fs.readFile('./aa.txt', 'utf8', (err, data) => console.log(data)));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (err) {
    console.log(err.name);
    switch (err.name) {
      case 'JsonWebTokenError':
        res.json({ code: 401, msg: '登录未授权' }); // 无效的token
        break;
      case 'TokenExpiredError':
        res.json({ code: 401, msg: 'token过期，请重新登录' });
        break;
    }
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
