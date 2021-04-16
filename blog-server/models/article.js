const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  title: String,
  description: String,
  htmlStr: String,
  markDownStr: String,
  category: {
    default: '前端',
    type: String
  },
  star: {
    default: 0,
    type: Number
  },
  digger_count: {
    default: 0,
    type: Number
  },
  article_tags: [{ type: Schema.Types.ObjectId, ref:"tags" }],
  digger_list: [{type: Schema.Types.ObjectId, ref: "likes"}],
  collection_count: {
    default: 0,
    type: Number
  },
  collection_list: [{type: Schema.Types.ObjectId, ref: "collections"}],
  comment_count: {
    default: 0,
    type: Number
  },
  view_count: {
    default: 0,
    type: Number
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  created: {
    type: String,
    default: new Date(),
  },
  headImgUrl: String
  },
  {
    timestamps: true, //为每一条记录增加一个创建和修改的时间戳
  }
)

module.exports = mongoose.model('articles', modelSchema);
