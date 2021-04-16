const mongoose = require('mongoose');
const { Bool } = require('mongoose/lib/schema/index');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  userInfo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
    required: true
  },
  articleInfo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "articles"
  },
  commentInfo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "comments"
  },
  from: {
    default: 'article',
    type: String
  },
  is_digger: {
    default: true,
    type: Boolean
  }
}, {
  timestamps: true, //为每一条记录增加一个创建和修改的时间戳
})

module.exports = mongoose.model('likes', modelSchema);
